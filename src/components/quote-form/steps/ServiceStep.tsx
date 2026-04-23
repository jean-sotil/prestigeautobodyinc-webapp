'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { QuoteFormData, FormAction } from '../hooks/useQuoteForm';

interface ServiceStepProps {
  state: QuoteFormData;
  dispatch: React.Dispatch<FormAction>;
  errors: Record<string, string>;
}

type ServiceId = 'collision' | 'bodywork' | 'painting' | 'insurance';

const serviceOrder: readonly ServiceId[] = [
  'collision',
  'bodywork',
  'painting',
  'insurance',
] as const;

const serviceIcons: Record<
  ServiceId,
  (props: { className?: string }) => React.ReactNode
> = {
  collision: CollisionIcon,
  bodywork: BodyworkIcon,
  painting: PaintingIcon,
  insurance: InsuranceIcon,
};

export function ServiceStep({ state, dispatch, errors }: ServiceStepProps) {
  const t = useTranslations('home.quote.services');
  const selected = state.service as ServiceId | '';
  const errorMessage = errors.service;
  const hasError = Boolean(errorMessage);

  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [shake, setShake] = useState(false);
  const prevErrorRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (errorMessage && errorMessage !== prevErrorRef.current) {
      setShake(true);
      const id = window.setTimeout(() => setShake(false), 400);
      prevErrorRef.current = errorMessage;
      return () => window.clearTimeout(id);
    }
    prevErrorRef.current = errorMessage;
  }, [errorMessage]);

  const activeIndex = selected
    ? serviceOrder.indexOf(selected as ServiceId)
    : 0;

  function select(id: ServiceId) {
    dispatch({ type: 'UPDATE_FIELD', field: 'service', value: id });
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    idx: number,
  ) {
    let nextIdx = idx;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIdx = (idx + 1) % serviceOrder.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIdx = (idx - 1 + serviceOrder.length) % serviceOrder.length;
        break;
      case 'Home':
        nextIdx = 0;
        break;
      case 'End':
        nextIdx = serviceOrder.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const nextId = serviceOrder[nextIdx];
    select(nextId);
    buttonRefs.current[nextIdx]?.focus();
  }

  return (
    <div>
      <p
        id="service-prompt"
        className="text-base md:text-lg font-medium text-foreground mb-4 md:mb-5"
      >
        {t('prompt')}
      </p>

      <div
        role="radiogroup"
        aria-labelledby="service-prompt"
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? 'service-error' : undefined}
        className={`grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 ${
          shake ? 'animate-shake' : ''
        }`}
      >
        {serviceOrder.map((id, idx) => {
          const Icon = serviceIcons[id];
          const isSelected = selected === id;
          const isTabStop = idx === activeIndex;
          return (
            <button
              key={id}
              ref={(el) => {
                buttonRefs.current[idx] = el;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isTabStop ? 0 : -1}
              onClick={() => select(id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={[
                'group relative overflow-hidden flex flex-col items-start text-left',
                'p-5 md:p-6 rounded-xl border bg-card',
                'transition-[transform,box-shadow,border-color] duration-200 ease-out',
                'min-h-[180px] md:min-h-[192px]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                isSelected
                  ? 'border-primary shadow-md'
                  : 'border-border shadow-sm hover:-translate-y-0.5 hover:border-red-border hover:shadow-md',
              ].join(' ')}
            >
              {isSelected && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-surface via-transparent to-transparent"
                />
              )}

              {isSelected && (
                <span
                  aria-hidden="true"
                  className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
                >
                  <svg
                    viewBox="0 0 12 12"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2.5 6l2.5 2.5L9.5 3.5" />
                  </svg>
                </span>
              )}

              <span
                className={[
                  'relative mb-4 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-lg border',
                  'transition-colors duration-150',
                  isSelected
                    ? 'bg-primary/15 border-primary/40 text-primary'
                    : 'bg-red-surface border-red-border text-red-hover',
                ].join(' ')}
              >
                <Icon className="h-7 w-7 md:h-8 md:w-8" />
              </span>

              <span
                className={[
                  'relative font-display text-base md:text-lg font-bold tracking-display mb-1.5 leading-tight',
                  isSelected ? 'text-primary' : 'text-foreground',
                ].join(' ')}
              >
                {t(`${id}.title`)}
              </span>

              <span className="relative text-xs md:text-sm leading-relaxed text-muted-foreground">
                {t(`${id}.description`)}
              </span>
            </button>
          );
        })}
      </div>

      {hasError && (
        <p
          id="service-error"
          role="alert"
          className="flex items-center gap-2 mt-4 text-sm text-destructive"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="h-4 w-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="8" cy="8" r="6.5" />
            <path d="M8 5v3.5" />
            <path d="M8 11h.01" />
          </svg>
          {errorMessage}
        </p>
      )}
    </div>
  );
}

function CollisionIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 8l10 10" />
      <path d="M6 12a4 4 0 0 1 6-4" />
      <path d="M18 18l-4 4" />
      <path d="M32 8L22 18" />
      <path d="M34 12a4 4 0 0 0-6-4" />
      <path d="M22 18l4 4" />
      <path d="M20 26v4M16 27l-1.5 3M24 27l1.5 3" />
    </svg>
  );
}

function BodyworkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="6" y="18" width="28" height="12" rx="2.5" />
      <path d="M10 18l3-8h14l3 8" />
      <circle cx="12" cy="24" r="2.5" />
      <circle cx="28" cy="24" r="2.5" />
      <path d="M17 21h6" />
      <path d="M6 22H3M37 22h-3" />
    </svg>
  );
}

function PaintingIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 15h9l3 3v6l-3 3H8z" />
      <path d="M17 21h7l5-5" />
      <path d="M29 16l5-5" />
      <path d="M31 8l3 3" />
      <path d="M5 17l-2-1.5M5 21H2M5 25l-2 1.5" />
    </svg>
  );
}

function InsuranceIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="8" y="4" width="20" height="28" rx="2" />
      <path d="M13 12h10M13 17h10M13 22h6" />
      <circle cx="28" cy="30" r="7" />
      <path d="M25 30l2 2 4-4" />
    </svg>
  );
}
