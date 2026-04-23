'use client';

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { z } from 'zod';
import { useQuoteForm } from './hooks/useQuoteForm';
import { useSubmitQuote } from './hooks/useSubmitQuote';
import { FormProgress } from './FormProgress';
import { FormNavigation } from './FormNavigation';
import { QuoteConfirmation } from './QuoteConfirmation';
import { ServiceStep } from './steps/ServiceStep';
import { VehicleStep } from './steps/VehicleStep';
import { DamageStep } from './steps/DamageStep';
import { ContactStep } from './steps/ContactStep';
import { trackEvent } from '@/lib/analytics';
import { useTranslations } from 'next-intl';
import { SectionHeading } from '../ui/SectionHeading';

// ============================================================================
// Zod Schemas (per-step validation)
// ============================================================================

const stepSchemas = {
  0: z.object({
    service: z.enum(['collision', 'bodywork', 'painting', 'insurance'], {
      message: 'Please select a service',
    }),
  }),
  1: z.object({
    year: z.string().min(1, "Please select your vehicle's year"),
    make: z.string().min(1, "Please select your vehicle's make"),
  }),
  2: z.object({
    damage: z.enum(['minor', 'moderate', 'major', 'unsure'], {
      message: 'Please select a damage level',
    }),
  }),
  3: z.object({
    firstName: z.string().min(1, 'First name is required').max(50),
    phone: z.string().regex(/^\d{10,}$/, 'Please enter a valid phone number'),
    email: z.string().email('Please enter a valid email address'),
  }),
} as const;

type StepIndex = keyof typeof stepSchemas;

// ============================================================================
// Step Names
// ============================================================================

const stepNames = ['Service', 'Vehicle', 'Damage', 'Contact'];

// ============================================================================
// Inner Form (needs QueryClient context)
// ============================================================================

function QuoteFormInner() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { state, dispatch, addFiles, removeFile, clearDraft } = useQuoteForm();
  const formStartedRef = useRef(false);
  const [mountTime] = useState(() => Date.now());

  const {
    submit,
    isPending,
    isSuccess,
    data: submitResult,
  } = useSubmitQuote(() => {
    clearDraft();
  });

  // Track form abandonment on beforeunload
  useEffect(() => {
    function handleBeforeUnload() {
      if (currentStep > 0 && !isSuccess) {
        trackEvent('quote_form_abandon', {
          last_step: currentStep,
          step_name: stepNames[currentStep],
          time_spent: Math.round((Date.now() - mountTime) / 1000),
        });
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentStep, isSuccess, mountTime]);

  // Track form start (first service selection)
  useEffect(() => {
    if (state.service && !formStartedRef.current) {
      formStartedRef.current = true;
      trackEvent('quote_form_start', { service_selected: state.service });
    }
  }, [state.service]);

  // ---- Validation ----
  const validateStep = useCallback(
    (step: StepIndex): boolean => {
      const schema = stepSchemas[step];
      const result = schema.safeParse(state);

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of result.error.issues) {
          const field = issue.path[0] as string;
          if (!fieldErrors[field]) {
            fieldErrors[field] = issue.message;
          }
        }
        setErrors(fieldErrors);

        // Focus first invalid field
        const firstField = Object.keys(fieldErrors)[0];
        if (firstField) {
          const el = document.querySelector(
            `[aria-invalid="true"], [name="${firstField}"]`,
          ) as HTMLElement;
          el?.focus();
        }

        return false;
      }

      setErrors({});
      return true;
    },
    [state],
  );

  // ---- Navigation ----
  function handleNext() {
    if (!validateStep(currentStep as StepIndex)) return;
    setDirection('forward');
    setCurrentStep((prev) => Math.min(prev + 1, 3));
    trackEvent('quote_form_step', {
      step_number: currentStep + 2,
      step_name: stepNames[currentStep + 1],
      direction: 'forward',
    });
  }

  function handleBack() {
    setErrors({});
    setDirection('backward');
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    trackEvent('quote_form_step', {
      step_number: currentStep,
      step_name: stepNames[currentStep - 1],
      direction: 'backward',
    });
  }

  function handleStepClick(step: number) {
    if (step < currentStep) {
      setErrors({});
      setDirection('backward');
      setCurrentStep(step);
    }
  }

  function handleSubmit() {
    if (!validateStep(3)) return;
    submit(state);
  }

  function handleReset() {
    dispatch({ type: 'RESET' });
    setCurrentStep(0);
    setErrors({});
    setDirection('forward');
    formStartedRef.current = false;
  }

  // ---- Render ----
  if (isSuccess) {
    return (
      <QuoteConfirmation
        data={state}
        referenceId={submitResult?.referenceId}
        onReset={handleReset}
      />
    );
  }

  return (
    <>
      <FormProgress currentStep={currentStep} onStepClick={handleStepClick} />

      <div
        aria-live="polite"
        key={currentStep}
        className={
          direction === 'forward'
            ? 'animate-slideInRight'
            : 'animate-slideInLeft'
        }
      >
        {currentStep === 0 && (
          <ServiceStep state={state} dispatch={dispatch} errors={errors} />
        )}
        {currentStep === 1 && (
          <VehicleStep state={state} dispatch={dispatch} errors={errors} />
        )}
        {currentStep === 2 && (
          <DamageStep
            state={state}
            dispatch={dispatch}
            errors={errors}
            addFiles={addFiles}
            removeFile={removeFile}
          />
        )}
        {currentStep === 3 && (
          <ContactStep state={state} dispatch={dispatch} errors={errors} />
        )}
      </div>

      <FormNavigation
        currentStep={currentStep}
        onNext={handleNext}
        onBack={handleBack}
        onSubmit={handleSubmit}
        isPending={isPending}
      />

      <p className="text-center text-xs text-gray-400 mt-4">Draft auto-saved</p>
    </>
  );
}

// ============================================================================
// Exported Component
// ============================================================================

interface QuoteFormProps {
  sidebar?: ReactNode;
}

export default function QuoteForm({ sidebar }: QuoteFormProps = {}) {
  const hasSidebar = Boolean(sidebar);
  const t = useTranslations('home');

  const formColumn = (
    <div>
      <SectionHeading
        id="get-a-free-estimate"
        overline={t('quote.ctaButton')}
        heading={t('quote.title')}
      />
      <QuoteFormInner />
    </div>
  );

  return (
    <section
      id="get-a-quote"
      className="relative z-0 w-full bg-white dark:bg-[#252525] shadow-2xl p-6 md:p-10"
    >
      {hasSidebar ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-10 items-start">
          {formColumn}
          <aside
            aria-label="Contact information"
            className="lg:sticky lg:top-26 space-y-4"
          >
            {sidebar}
          </aside>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">{formColumn}</div>
      )}
    </section>
  );
}
