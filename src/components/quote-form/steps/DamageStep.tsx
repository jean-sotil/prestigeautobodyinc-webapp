'use client';

import { useId } from 'react';
import type { QuoteFormData, FormAction } from '../hooks/useQuoteForm';

// ============================================================================
// Types
// ============================================================================

interface DamageStepProps {
  state: QuoteFormData;
  dispatch: React.Dispatch<FormAction>;
  errors: Record<string, string>;
}

type SeverityId = 'minor' | 'moderate' | 'major' | 'unsure';

interface SeverityOption {
  id: SeverityId;
  label: string;
  description: string;
  dotColor: string;
  bgSelected: string;
}

// ============================================================================
// Severity Options
// ============================================================================

const severities: SeverityOption[] = [
  {
    id: 'minor',
    label: 'Minor',
    description: 'Small dents, scratches, scuffs',
    dotColor: 'bg-[#22C55E]',
    bgSelected: 'bg-green-50/60 dark:bg-green-900/10',
  },
  {
    id: 'moderate',
    label: 'Moderate',
    description: 'Panel damage, cracked bumper',
    dotColor: 'bg-[#F59E0B]',
    bgSelected: 'bg-amber-50/60 dark:bg-amber-900/10',
  },
  {
    id: 'major',
    label: 'Major',
    description: 'Structural damage, multiple panels',
    dotColor: 'bg-[#DC2626]',
    bgSelected: 'bg-red-50/60 dark:bg-red-900/10',
  },
  {
    id: 'unsure',
    label: 'Not Sure',
    description: 'Needs professional assessment',
    dotColor: 'bg-[#6B7280]',
    bgSelected: 'bg-gray-50/60 dark:bg-gray-800/20',
  },
];

// ============================================================================
// Component
// ============================================================================

export function DamageStep({ state, dispatch, errors }: DamageStepProps) {
  const id = useId();
  const descId = `${id}-desc`;
  const charCount = state.description.length;

  return (
    <div className="space-y-6">
      {/* Severity cards */}
      <div>
        <div
          className="grid grid-cols-2 gap-4"
          role="radiogroup"
          aria-label="Select damage severity"
        >
          {severities.map((sev) => {
            const isSelected = state.damage === sev.id;
            return (
              <button
                key={sev.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    field: 'damage',
                    value: sev.id,
                  })
                }
                className={`group flex items-start gap-3 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left min-h-[44px] focus-visible:ring-2 focus-visible:ring-[#C62828] focus-visible:ring-offset-2 ${
                  isSelected
                    ? `border-[#C62828] ${sev.bgSelected} shadow-sm`
                    : 'border-gray-200 dark:border-[#333333] bg-white dark:bg-[#252525] hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <span
                  className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${sev.dotColor}`}
                  aria-hidden="true"
                />
                <div>
                  <span
                    className={`text-sm font-bold block ${
                      isSelected
                        ? 'text-[#C62828]'
                        : 'text-gray-900 dark:text-[#E0E0E0]'
                    }`}
                  >
                    {sev.label}
                  </span>
                  <span className="text-xs leading-relaxed text-gray-500 dark:text-[#A0A0A0]">
                    {sev.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        {errors.damage && (
          <p className="text-sm text-[#DC2626] mt-3" role="alert">
            {errors.damage}
          </p>
        )}
      </div>

      {/* Description textarea */}
      <div>
        <label
          htmlFor={descId}
          className="block text-sm font-medium text-gray-900 dark:text-[#E0E0E0] mb-1.5"
        >
          Describe the Damage{' '}
          <span className="text-gray-400 text-xs font-normal">(optional)</span>
        </label>
        <textarea
          id={descId}
          value={state.description}
          onChange={(e) => {
            if (e.target.value.length <= 500) {
              dispatch({
                type: 'UPDATE_FIELD',
                field: 'description',
                value: e.target.value,
              });
            }
          }}
          placeholder="Describe the damage (optional)..."
          maxLength={500}
          className="w-full min-h-[100px] resize-y rounded-lg border border-gray-300 dark:border-[#444444] bg-white dark:bg-[#1E1E1E] px-4 py-3 text-base text-gray-900 dark:text-[#E0E0E0] transition-colors focus:border-[#C62828] focus:ring-1 focus:ring-[#C62828] focus-visible:ring-2 focus-visible:ring-[#C62828] focus-visible:ring-offset-2"
        />
        <p className="text-xs text-gray-400 text-right mt-1">{charCount}/500</p>
      </div>

      {/* Photo toggle */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={state.hasPhotos}
          onClick={() =>
            dispatch({
              type: 'UPDATE_FIELD',
              field: 'hasPhotos',
              value: !state.hasPhotos,
            })
          }
          className={`relative w-11 h-6 rounded-full flex-shrink-0 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#C62828] focus-visible:ring-offset-2 ${
            state.hasPhotos ? 'bg-[#C62828]' : 'bg-gray-300 dark:bg-[#444444]'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
              state.hasPhotos ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <div>
          <span className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">
            I have photos to share
          </span>
          <p className="text-xs text-gray-500 dark:text-[#A0A0A0] mt-0.5">
            You can send them after submitting (via text or email).
          </p>
        </div>
      </div>
    </div>
  );
}
