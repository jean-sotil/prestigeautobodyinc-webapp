'use client';

import { useMutation } from '@tanstack/react-query';
import { trackEvent } from '@/lib/analytics';
import type { QuoteFormData } from './useQuoteForm';

// ============================================================================
// Types
// ============================================================================

interface QuotePayload {
  service: string;
  vehicle: { year: number; make: string; model: string };
  damage: { severity: string; description: string; hasPhotos: boolean };
  contact: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    preferredMethod: string;
  };
  metadata: {
    source: string;
    page: string;
    submittedAt: string;
    locale: string;
    userAgent: string;
  };
}

// ============================================================================
// Payload Builder
// ============================================================================

function buildPayload(state: QuoteFormData): QuotePayload {
  return {
    service: state.service,
    vehicle: {
      year: parseInt(state.year, 10),
      make: state.make,
      model: state.model,
    },
    damage: {
      severity: state.damage,
      description: state.description,
      hasPhotos: state.hasPhotos,
    },
    contact: {
      firstName: state.firstName.trim(),
      lastName: state.lastName.trim(),
      phone: state.phone,
      email: state.email.trim().toLowerCase(),
      preferredMethod: state.contactMethod,
    },
    metadata: {
      source: 'website',
      page: typeof window !== 'undefined' ? window.location.pathname : '/',
      submittedAt: new Date().toISOString(),
      locale:
        typeof document !== 'undefined'
          ? document.documentElement.lang || 'en'
          : 'en',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    },
  };
}

// ============================================================================
// Hook
// ============================================================================

export function useSubmitQuote(onSuccess?: () => void) {
  return useMutation({
    mutationFn: async (state: QuoteFormData) => {
      const payload = buildPayload(state);
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Submission failed: ${res.status}`);
      return res.json();
    },
    onSuccess: () => {
      trackEvent('quote_form_submit', { status: 'success' });
      onSuccess?.();
    },
    onError: (error: Error) => {
      trackEvent('quote_form_error', { error_type: error.message });
    },
  });
}
