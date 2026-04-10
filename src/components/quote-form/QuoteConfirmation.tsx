'use client';

import type { QuoteFormData } from './hooks/useQuoteForm';

// ============================================================================
// Types
// ============================================================================

interface QuoteConfirmationProps {
  data: QuoteFormData;
  onReset: () => void;
}

// ============================================================================
// Helpers
// ============================================================================

const serviceLabels: Record<string, string> = {
  collision: 'Collision Repair',
  bodywork: 'Auto Body Work',
  painting: 'Auto Painting',
  insurance: 'Insurance Claim',
};

const severityLabels: Record<string, string> = {
  minor: 'Minor',
  moderate: 'Moderate',
  major: 'Major',
  unsure: 'Not Sure',
};

const contactLabels: Record<string, string> = {
  phone: 'Phone',
  text: 'Text',
  email: 'Email',
};

// ============================================================================
// Component
// ============================================================================

export function QuoteConfirmation({ data, onReset }: QuoteConfirmationProps) {
  const vehicleStr = [data.year, data.make, data.model]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="text-center py-4">
      {/* Animated checkmark */}
      <div className="mx-auto w-16 h-16 rounded-full bg-[#C62828] flex items-center justify-center mb-6 animate-[scaleIn_400ms_ease-out]">
        <svg
          className="w-8 h-8 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h3
        className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-[#E0E0E0] mb-2"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Quote Request Sent!
      </h3>
      <p className="text-gray-600 dark:text-[#A0A0A0] mb-8">
        Thank you, {data.firstName}. Our team will contact you within 2 business
        hours.
      </p>

      {/* Summary card */}
      <div className="bg-gray-50 dark:bg-[#1E1E1E] rounded-xl p-6 text-left max-w-md mx-auto mb-6">
        <h4 className="text-sm font-bold text-gray-900 dark:text-[#E0E0E0] mb-4 uppercase tracking-wide">
          Request Summary
        </h4>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500 dark:text-[#A0A0A0]">Service</dt>
            <dd className="font-medium text-gray-900 dark:text-[#E0E0E0]">
              {serviceLabels[data.service] || data.service}
            </dd>
          </div>
          {vehicleStr && (
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-[#A0A0A0]">Vehicle</dt>
              <dd className="font-medium text-gray-900 dark:text-[#E0E0E0]">
                {vehicleStr}
              </dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-gray-500 dark:text-[#A0A0A0]">Damage Level</dt>
            <dd className="font-medium text-gray-900 dark:text-[#E0E0E0]">
              {severityLabels[data.damage] || data.damage}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500 dark:text-[#A0A0A0]">Contact Via</dt>
            <dd className="font-medium text-gray-900 dark:text-[#E0E0E0]">
              {contactLabels[data.contactMethod] || data.contactMethod}
            </dd>
          </div>
        </dl>
      </div>

      {/* Photo instructions */}
      {data.hasPhotos && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-5 text-left max-w-md mx-auto mb-6">
          <p className="text-sm font-bold text-amber-800 dark:text-amber-200 mb-2">
            Send Your Photos
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-300 mb-1">
            Text your photos to{' '}
            <a href="tel:3015788779" className="font-semibold underline">
              (301) 578-8779
            </a>
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Or email them to{' '}
            <a
              href="mailto:info@prestigeautobodyinc.com"
              className="font-semibold underline"
            >
              info@prestigeautobodyinc.com
            </a>
          </p>
        </div>
      )}

      {/* Reset link */}
      <button
        type="button"
        onClick={onReset}
        className="text-[#C62828] hover:underline font-medium text-sm focus-visible:ring-2 focus-visible:ring-[#C62828] focus-visible:ring-offset-2 min-h-[44px]"
      >
        Submit another request
      </button>
    </div>
  );
}
