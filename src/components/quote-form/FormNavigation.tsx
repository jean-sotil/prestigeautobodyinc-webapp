'use client';

import { useTranslations } from 'next-intl';

interface FormNavigationProps {
  currentStep: number;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  isPending: boolean;
}

const primaryClasses =
  'h-12 rounded-lg font-semibold text-base bg-primary hover:bg-red-pressed text-primary-foreground shadow-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60 disabled:cursor-not-allowed';

const backClasses =
  'h-12 px-4 rounded-md text-foreground/70 hover:text-foreground font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export function FormNavigation({
  currentStep,
  onNext,
  onBack,
  onSubmit,
  isPending,
}: FormNavigationProps) {
  const t = useTranslations('home.quote.nav');
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === 3;

  if (isFirstStep) {
    return (
      <div className="mt-8">
        <button
          type="button"
          onClick={onNext}
          className={`w-full ${primaryClasses}`}
        >
          {t('next')}
        </button>
      </div>
    );
  }

  if (isLastStep) {
    return (
      <div className="mt-8 flex items-center justify-between gap-4">
        <button type="button" onClick={onBack} className={backClasses}>
          {t('back')}
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isPending}
          className={`flex flex-1 items-center justify-center gap-2 ${primaryClasses}`}
        >
          {isPending && <Spinner />}
          <span>{isPending ? t('submitting') : t('submit')}</span>
        </button>
        <span role="status" aria-live="polite" className="sr-only">
          {isPending ? t('submittingStatus') : ''}
        </span>
      </div>
    );
  }

  return (
    <div className="mt-8 flex items-center justify-between gap-4">
      <button type="button" onClick={onBack} className={backClasses}>
        {t('back')}
      </button>
      <button
        type="button"
        onClick={onNext}
        className={`flex-1 ${primaryClasses}`}
      >
        {t('continue')}
      </button>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 animate-spin text-primary-foreground"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        className="opacity-25"
      />
      <path
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        className="opacity-75"
      />
    </svg>
  );
}
