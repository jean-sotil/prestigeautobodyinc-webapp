'use client';

import type { QuoteFormData, FormAction } from '../hooks/useQuoteForm';
import classNames from 'classnames';

// ============================================================================
// Types
// ============================================================================

interface ServiceStepProps {
  state: QuoteFormData;
  dispatch: React.Dispatch<FormAction>;
  errors: Record<string, string>;
}

type ServiceId = 'collision' | 'bodywork' | 'painting' | 'insurance';

interface ServiceOption {
  id: ServiceId;
  title: string;
  description: string;
  icon: (props: { className?: string }) => React.ReactNode;
}

// ============================================================================
// SVG Icons (stroke-based, currentColor)
// ============================================================================

function CollisionIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`w-10 h-10 ${className ?? ''}`}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Wrench left */}
      <path d="M8 8l10 10" />
      <path d="M6 12a4 4 0 0 1 6-4" />
      <path d="M18 18l-4 4" />
      {/* Wrench right */}
      <path d="M32 8L22 18" />
      <path d="M34 12a4 4 0 0 0-6-4" />
      <path d="M22 18l4 4" />
      {/* Impact star */}
      <path d="M20 26v4M16 27l-1.5 3M24 27l1.5 3" />
    </svg>
  );
}

function BodyworkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`w-10 h-10 ${className ?? ''}`}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Car body */}
      <rect x="6" y="18" width="28" height="12" rx="2.5" />
      {/* Roof / windshield */}
      <path d="M10 18l3-8h14l3 8" />
      {/* Headlights */}
      <circle cx="12" cy="24" r="2.5" />
      <circle cx="28" cy="24" r="2.5" />
      {/* Grille */}
      <path d="M17 21h6" />
      {/* Side mirrors */}
      <path d="M6 22H3M37 22h-3" />
    </svg>
  );
}

function PaintingIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`w-10 h-10 ${className ?? ''}`}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Gun body */}
      <path d="M8 15h9l3 3v6l-3 3H8z" />
      {/* Nozzle */}
      <path d="M17 21h7l5-5" />
      <path d="M29 16l5-5" />
      <path d="M31 8l3 3" />
      {/* Spray mist */}
      <path d="M5 17l-2-1.5M5 21H2M5 25l-2 1.5" />
    </svg>
  );
}

function InsuranceIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`w-10 h-10 ${className ?? ''}`}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Document */}
      <rect x="8" y="4" width="20" height="28" rx="2" />
      <path d="M13 12h10M13 17h10M13 22h6" />
      {/* Checkmark circle */}
      <circle cx="28" cy="30" r="7" />
      <path d="M25 30l2 2 4-4" />
    </svg>
  );
}

// ============================================================================
// Service Options
// ============================================================================

const services: ServiceOption[] = [
  {
    id: 'collision',
    title: 'Collision Repair',
    description:
      'Restore your vehicle to pre-accident condition with certified technicians',
    icon: CollisionIcon,
  },
  {
    id: 'bodywork',
    title: 'Auto Body Work',
    description:
      'Dent removal, frame repair, panel replacement and structural restoration',
    icon: BodyworkIcon,
  },
  {
    id: 'painting',
    title: 'Auto Painting',
    description:
      'Professional color matching and premium paint finishes with downdraft booth',
    icon: PaintingIcon,
  },
  {
    id: 'insurance',
    title: 'Insurance Claim',
    description:
      'We handle your insurance claim process and work with all major carriers',
    icon: InsuranceIcon,
  },
];

// ============================================================================
// Component
// ============================================================================

export function ServiceStep({ state, dispatch, errors }: ServiceStepProps) {
  const selected = state.service;

  return (
    <div>
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        role="radiogroup"
        aria-label="Select a service"
      >
        {services.map((svc) => {
          const isSelected = selected === svc.id;
          return (
            <button
              key={svc.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() =>
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'service',
                  value: svc.id,
                })
              }
              className={`group flex flex-col items-center text-center p-5 md:p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer min-h-[44px] focus-visible:ring-2 focus-visible:ring-[#C62828] focus-visible:ring-offset-2 ${
                isSelected
                  ? 'border-[#C62828] bg-red-50/60 dark:bg-red-900/20 shadow-sm'
                  : 'border-gray-200 dark:border-[#333333] bg-white dark:bg-[#252525] hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <svc.icon
                className={classNames(
                  {
                    'text-[#C62828]': isSelected,
                    'text-gray-500 group-hover:text-gray-700 dark:text-gray-400':
                      !isSelected,
                  },
                  'size-4',
                )}
              />
              <span
                className={`text-sm md:text-[15px] font-bold mb-1.5 ${
                  isSelected
                    ? 'text-[#C62828]'
                    : 'text-gray-900 dark:text-[#E0E0E0]'
                }`}
              >
                {svc.title}
              </span>
              <span className="text-xs md:text-[13px] leading-relaxed text-gray-500 dark:text-[#A0A0A0]">
                {svc.description}
              </span>
            </button>
          );
        })}
      </div>
      {errors.service && (
        <p className="text-sm text-[#DC2626] mt-3" role="alert">
          {errors.service}
        </p>
      )}
    </div>
  );
}
