'use client';

// ============================================================================
// Types
// ============================================================================

interface FormProgressProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

// ============================================================================
// Constants
// ============================================================================

const stepLabels = ['Service', 'Vehicle', 'Damage', 'Contact'];
const totalSteps = 4;

// ============================================================================
// Checkmark SVG
// ============================================================================

function CheckIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 animate-[scaleIn_300ms_ease-out]"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 7.5L5.5 10L11 4"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ============================================================================
// Component
// ============================================================================

export function FormProgress({ currentStep, onStepClick }: FormProgressProps) {
  const percent = Math.round(((currentStep + 1) / totalSteps) * 100);
  const fillPercent = (currentStep / (totalSteps - 1)) * 100;

  return (
    <div className="mb-10">
      {/* Header row */}
      <div className="flex justify-between items-baseline text-sm mb-6">
        <span className="font-semibold text-gray-800 dark:text-[#E0E0E0]">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-gray-400 dark:text-[#A0A0A0] tabular-nums">
          {percent}%
        </span>
      </div>

      {/* ── Track + dots ── */}
      <div style={{ position: 'relative', marginBottom: 4 }}>
        {/* Flex row for dots — establishes layout positions */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 32,
          }}
        >
          {/* Track background — full-width gray line connecting all dots */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              height: 3,
              borderRadius: 9999,
              backgroundColor: '#E5E7EB',
              zIndex: 0,
            }}
            className="dark:!bg-[#333333]"
          />

          {/* Track fill — red animated line */}
          <div
            className="progress-fill-track"
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              height: 3,
              borderRadius: 9999,
              width: `${fillPercent}%`,
              background:
                'linear-gradient(90deg, #C62828 0%, #EF5350 50%, #C62828 100%)',
              backgroundSize: '200% 100%',
              zIndex: 1,
            }}
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Form progress: ${percent}%`}
          />

          {/* Step dots */}
          {stepLabels.map((label, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isClickable = isCompleted;

            return (
              <div
                key={label}
                style={{
                  position: 'relative',
                  zIndex: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Dot button */}
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick(index)}
                  className={`flex items-center justify-center rounded-full transition-all duration-300 ease-out ${
                    isCurrent
                      ? 'w-8 h-8 bg-[#C62828] shadow-[0_0_0_4px_rgba(198,40,40,0.15)] progress-dot-active'
                      : isCompleted
                        ? 'w-7 h-7 bg-[#C62828] cursor-pointer hover:scale-110 hover:shadow-md'
                        : 'w-7 h-7 bg-white dark:bg-[#252525] border-2 border-gray-300 dark:border-[#444444]'
                  }`}
                  aria-label={`Step ${index + 1} of ${totalSteps}: ${label}${isCurrent ? ' (current)' : ''}${isCompleted ? ' (completed)' : ''}`}
                >
                  {isCompleted && <CheckIcon />}
                  {isCurrent && (
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-[scaleIn_300ms_ease-out]" />
                  )}
                </button>

                {/* Label below dot */}
                <span
                  className={`absolute top-full mt-2.5 text-[11px] font-semibold tracking-wide hidden sm:block select-none whitespace-nowrap transition-colors duration-300 ${
                    isCurrent
                      ? 'text-[#C62828]'
                      : isCompleted
                        ? 'text-gray-500 dark:text-gray-400'
                        : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
