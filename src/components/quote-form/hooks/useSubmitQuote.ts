'use client';

import { useMutation } from '@tanstack/react-query';
import { trackEvent } from '@/lib/analytics';
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

// ============================================================================
// Constants
// ============================================================================

const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20 MB total

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
// Hook
// ============================================================================

export function useSubmitQuote(onSuccess?: (result: SubmitResult) => void) {
  return useMutation<SubmitResult, SubmitError, QuoteFormData>({
    mutationFn: async (state) => {
      // Validate files before submission
      const fileValidation = validateFiles(state);
      if (!fileValidation.valid) {
        throw {
          error: 'validation',
          message: fileValidation.error || 'File validation failed',
        } as SubmitError;
      }

      const formData = buildFormData(state);

      const res = await fetch('/api/quote', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - browser will set it with boundary for multipart
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw {
          error: errorData.error || 'server_error',
          message: errorData.message || `Submission failed: ${res.status}`,
          fields: errorData.fields,
        } as SubmitError;
      }

      return res.json();
    },
    onSuccess: (result) => {
      trackEvent('quote_form_submit', {
        status: 'success',
        referenceId: result.referenceId,
      });
      onSuccess?.(result);
    },
    onError: (error: SubmitError) => {
      trackEvent('quote_form_error', {
        error_type: error.error,
        message: error.message,
      });
    },
  });
}
