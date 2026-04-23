'use client';

import { useTranslations } from 'next-intl';

interface FormProgressProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

const stepKeys = ['service', 'vehicle', 'damage', 'contact'] as const;
const totalSteps = stepKeys.length;

export function FormProgress({ currentStep, onStepClick }: FormProgressProps) {
  const t = useTranslations('home.quote.progress');
  const percent = Math.round(((currentStep + 1) / totalSteps) * 100);
  const fillPercent = (currentStep / (totalSteps - 1)) * 100;

  return (
    <div className="mb-10">
      <div className="flex items-baseline justify-between mb-6 text-sm">
        <span className="font-semibold text-foreground">
          {t('stepCount', { current: currentStep + 1, total: totalSteps })}
        </span>
        <span className="text-muted-foreground tabular-nums">{percent}%</span>
      </div>

      <div className="relative h-8">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-muted"
        />

        <span
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t('ariaLabel', { percent })}
          style={{ width: `${fillPercent}%` }}
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-primary transition-[width] duration-500 ease-out"
        />

        <ol className="absolute inset-0 flex items-center justify-between list-none m-0 p-0">
          {stepKeys.map((key, index) => {
            const label = t(`steps.${key}`);
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isClickable = isCompleted;
            const ariaLabel = isCompleted
              ? t('stepAria.completed', { label })
              : isCurrent
                ? t('stepAria.current', { label })
                : t('stepAria.future', { label });

            return (
              <li
                key={key}
                className="relative z-10 flex flex-col items-center"
              >
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick(index)}
                  aria-label={ariaLabel}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={[
                    'flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 ease-out',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    isCurrent
                      ? 'bg-primary scale-110 shadow-[0_0_0_4px_var(--color-red-surface)]'
                      : isCompleted
                        ? 'bg-primary cursor-pointer hover:scale-110'
                        : 'bg-background border-2 border-border',
                  ].join(' ')}
                >
                  {isCompleted && <CheckIcon />}
                  {isCurrent && (
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 rounded-full bg-primary-foreground"
                    />
                  )}
                </button>

                <span
                  aria-hidden="true"
                  className={[
                    'absolute top-full mt-2.5 text-[11px] font-semibold tracking-wide whitespace-nowrap transition-colors duration-300',
                    'hidden sm:block',
                    isCurrent ? 'text-primary' : 'text-muted-foreground',
                  ].join(' ')}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 14 14"
      className="h-3.5 w-3.5 text-primary-foreground animate-[scaleIn_300ms_ease-out]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 7.5L5.5 10L11 4" />
    </svg>
  );
}
