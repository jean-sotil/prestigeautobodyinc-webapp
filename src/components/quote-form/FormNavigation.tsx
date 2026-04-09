'use client';

// ============================================================================
// Types
// ============================================================================

interface FormNavigationProps {
  currentStep: number;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  isPending: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function FormNavigation({
  currentStep,
  onNext,
  onBack,
  onSubmit,
  isPending,
}: FormNavigationProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === 3;

  const primaryClasses =
    'h-12 rounded-lg font-semibold text-base transition-colors duration-150 bg-[#C62828] hover:bg-[#B71C1C] active:bg-[#8E0000] text-white shadow-sm focus-visible:ring-2 focus-visible:ring-[#C62828] focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px]';
  const backClasses =
    'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium px-4 h-12 min-h-[44px] focus-visible:ring-2 focus-visible:ring-[#C62828] focus-visible:ring-offset-2 transition-colors';

  // Step 1: Next only, full-width
  if (isFirstStep) {
    return (
      <div className="mt-8">
        <button
          type="button"
          onClick={onNext}
          className={`w-full ${primaryClasses}`}
        >
          Next
        </button>
      </div>
    );
  }

  // Last step: Back + Submit
  if (isLastStep) {
    return (
      <div className="mt-8 flex justify-between items-center">
        <button type="button" onClick={onBack} className={backClasses}>
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isPending}
          className={`flex-1 ml-4 flex items-center justify-center gap-2 ${primaryClasses}`}
        >
          {isPending && (
            <svg
              className="w-5 h-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          {isPending ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    );
  }

  // Steps 2–3: Back + Continue
  return (
    <div className="mt-8 flex justify-between items-center">
      <button type="button" onClick={onBack} className={backClasses}>
        Back
      </button>
      <button
        type="button"
        onClick={onNext}
        className={`flex-1 ml-4 ${primaryClasses}`}
      >
        Continue
      </button>
    </div>
  );
}
