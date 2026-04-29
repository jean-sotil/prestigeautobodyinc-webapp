'use client';

import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { trackEvent } from '@/lib/analytics';
import type {
  ServiceType,
  DamageSeverity,
  FormErrorType,
} from '@/lib/analytics-events';
import type { QuoteFormData } from './useQuoteForm';

// ============================================================================
// Types
// ============================================================================

export interface SubmitResult {
  referenceId: string;
  photoCount: number;
  status: string;
}

export interface SubmitError {
  error: string;
  message: string;
  fields?: Record<string, string[]>;
}

export interface OptimisticState {
  isSubmitting: boolean;
  progress: number;
  statusMessage: string;
}

// ============================================================================
// Constants
// ============================================================================

const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20 MB total

function mapErrorType(error: unknown): FormErrorType {
  if (error && typeof error === 'object' && 'error' in error) {
    const code = (error as { error: string }).error;
    if (code === 'rate_limit') return 'rate_limit';
    if (
      code === 'validation' ||
      code === 'invalid_multipart' ||
      code === 'invalid_json' ||
      code === 'payload_too_large'
    ) {
      return 'validation';
    }
    return 'server';
  }
  return 'network';
}

// ============================================================================
// FormData Builder
// ============================================================================

function buildFormData(state: QuoteFormData): FormData {
  const formData = new FormData();

  // Honeypot field (should be empty)
  formData.append('_gotcha', '');

  // Service
  formData.append('service', state.service);

  // Vehicle
  formData.append('vehicle.year', state.year);
  formData.append('vehicle.make', state.make);
  formData.append('vehicle.model', state.model);
  if (state.vin) {
    formData.append('vehicle.vin', state.vin);
  }

  // Damage
  formData.append('damage.severity', state.damage);
  formData.append('damage.description', state.description);
  formData.append('hasPhotos', state.hasPhotos ? 'true' : 'false');

  // Contact
  formData.append('contact.firstName', state.firstName);
  formData.append('contact.lastName', state.lastName);
  formData.append('contact.phone', state.phone);
  formData.append('contact.email', state.email);
  formData.append('contact.preferredMethod', state.contactMethod);

  // Appointment
  if (state.date) {
    formData.append('appointment.date', state.date);
  }
  if (state.time) {
    formData.append('appointment.time', state.time);
  }
  if (state.notes) {
    formData.append('appointment.notes', state.notes);
  }

  // Metadata
  formData.append('metadata.locale', document.documentElement.lang || 'en');
  formData.append('metadata.source', 'website');
  formData.append('metadata.submittedAt', new Date().toISOString());
  formData.append('metadata.formLoadedAt', state.formLoadedAt.toString());
  formData.append('metadata.userAgent', navigator.userAgent);

  // Files
  state.files.forEach((file, index) => {
    formData.append(`file-${index}`, file, file.name);
  });

  return formData;
}

function validateFiles(state: QuoteFormData): {
  valid: boolean;
  error?: string;
} {
  const totalSize = state.files.reduce((sum, file) => sum + file.size, 0);

  if (totalSize > MAX_TOTAL_SIZE) {
    return {
      valid: false,
      error: `Total file size exceeds 20 MB limit. Current: ${Math.round(totalSize / 1024 / 1024)} MB`,
    };
  }

  return { valid: true };
}

// ============================================================================
// Hook with Optimistic UI
// ============================================================================

export interface UseSubmitQuoteReturn {
  /** Submit the quote form */
  submit: (data: QuoteFormData) => void;
  /** Reset the mutation state */
  reset: () => void;
  /** Whether the submission is in progress */
  isPending: boolean;
  /** Whether the submission was successful */
  isSuccess: boolean;
  /** Whether the submission failed */
  isError: boolean;
  /** The error if submission failed */
  error: SubmitError | null;
  /** The result if submission succeeded */
  data: SubmitResult | undefined;
  /** Optimistic UI state for progress indication */
  optimisticState: OptimisticState;
}

export function useSubmitQuote(
  onSuccess?: (result: SubmitResult) => void,
): UseSubmitQuoteReturn {
  // Optimistic UI state for instant feedback
  const [optimisticState, setOptimisticState] = useState<OptimisticState>({
    isSubmitting: false,
    progress: 0,
    statusMessage: '',
  });

  const mutation = useMutation<SubmitResult, SubmitError, QuoteFormData>({
    mutationFn: async (state) => {
      // Update optimistic state - starting validation
      setOptimisticState({
        isSubmitting: true,
        progress: 10,
        statusMessage: 'Validating your information...',
      });

      // Validate files before submission
      const fileValidation = validateFiles(state);
      if (!fileValidation.valid) {
        throw {
          error: 'validation',
          message: fileValidation.error || 'File validation failed',
        } as SubmitError;
      }

      // Update optimistic state - building request
      setOptimisticState({
        isSubmitting: true,
        progress: 25,
        statusMessage:
          state.files.length > 0
            ? `Preparing ${state.files.length} photo${state.files.length > 1 ? 's' : ''}...`
            : 'Preparing your request...',
      });

      const formData = buildFormData(state);

      // Update optimistic state - uploading
      setOptimisticState({
        isSubmitting: true,
        progress: 50,
        statusMessage: 'Sending to our team...',
      });

      const res = await fetch('/api/quote', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - browser will set it with boundary for multipart
      });

      // Update optimistic state - processing
      setOptimisticState({
        isSubmitting: true,
        progress: 75,
        statusMessage: 'Processing your request...',
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw {
          error: errorData.error || 'server_error',
          message: errorData.message || `Submission failed: ${res.status}`,
          fields: errorData.fields,
        } as SubmitError;
      }

      // Update optimistic state - completing
      setOptimisticState({
        isSubmitting: true,
        progress: 90,
        statusMessage: 'Finalizing...',
      });

      const result = await res.json();

      // Complete
      setOptimisticState({
        isSubmitting: false,
        progress: 100,
        statusMessage: 'Quote submitted successfully!',
      });

      return result;
    },
    onSuccess: (result, variables) => {
      trackEvent('quote_form_submit', {
        service_type: variables.service as ServiceType,
        damage_severity: variables.damage as DamageSeverity,
      });
      onSuccess?.(result);
    },
    onError: (error: SubmitError) => {
      // Reset optimistic state on error
      setOptimisticState({
        isSubmitting: false,
        progress: 0,
        statusMessage: '',
      });

      trackEvent('quote_form_error', {
        step: 4,
        error_type: mapErrorType(error),
      });
    },
  });

  // Wrapper submit function that matches the expected interface
  const submit = useCallback(
    (data: QuoteFormData) => {
      mutation.mutate(data);
    },
    [mutation],
  );

  // Wrapper reset function
  const reset = useCallback(() => {
    setOptimisticState({
      isSubmitting: false,
      progress: 0,
      statusMessage: '',
    });
    mutation.reset();
  }, [mutation]);

  return {
    submit,
    reset,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error || null,
    data: mutation.data,
    optimisticState,
  };
}
