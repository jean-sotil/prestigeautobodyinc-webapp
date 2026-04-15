'use client';

import { useId } from 'react';
import type { QuoteFormData, FormAction } from '../hooks/useQuoteForm';

// ============================================================================
// Types
// ============================================================================

interface VehicleStepProps {
  state: QuoteFormData;
  dispatch: React.Dispatch<FormAction>;
  errors: Record<string, string>;
}

// ============================================================================
// Constants
// ============================================================================

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1990 + 1 }, (_, i) =>
  String(currentYear - i),
);

const makes = [
  'Toyota',
  'Honda',
  'Ford',
  'Chevrolet',
  'BMW',
  'Mercedes-Benz',
  'Hyundai',
  'Nissan',
  'Kia',
  'Subaru',
  'Mazda',
  'Volkswagen',
  'Audi',
  'Lexus',
  'Acura',
  'Other',
];

// ============================================================================
// Shared input classes
// ============================================================================

const inputBase =
  'h-12 w-full rounded-lg border px-4 text-base transition-colors focus:border-[#C62828] focus:ring-1 focus:ring-[#C62828] focus-visible:ring-2 focus-visible:ring-[#C62828] focus-visible:ring-offset-2';
const inputNormal = `${inputBase} border-gray-300 dark:border-[#444444] bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-[#E0E0E0]`;
const inputError = `${inputBase} border-[#DC2626] bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-[#E0E0E0] animate-shake`;

// ============================================================================
// Component
// ============================================================================

export function VehicleStep({ state, dispatch, errors }: VehicleStepProps) {
  const id = useId();
  const yearId = `${id}-year`;
  const makeId = `${id}-make`;
  const modelId = `${id}-model`;
  const customMakeId = `${id}-custom-make`;

  const showCustomMake = state.make === 'Other';

  return (
    <div className="space-y-4">
      {/* Year + Make row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Year */}
        <div>
          <label
            htmlFor={yearId}
            className="block text-sm font-medium text-gray-900 dark:text-[#E0E0E0] mb-1.5"
          >
            Year <span className="text-[#DC2626]">*</span>
          </label>
          <select
            id={yearId}
            value={state.year}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_FIELD',
                field: 'year',
                value: e.target.value,
              })
            }
            className={errors.year ? inputError : inputNormal}
            aria-describedby={errors.year ? `${yearId}-error` : undefined}
            aria-invalid={!!errors.year}
          >
            <option value="">Select year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          {errors.year && (
            <p
              id={`${yearId}-error`}
              className="text-sm text-[#DC2626] mt-1"
              role="alert"
            >
              {errors.year}
            </p>
          )}
        </div>

        {/* Make */}
        <div>
          <label
            htmlFor={makeId}
            className="block text-sm font-medium text-gray-900 dark:text-[#E0E0E0] mb-1.5"
          >
            Make <span className="text-[#DC2626]">*</span>
          </label>
          <select
            id={makeId}
            value={state.make}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_FIELD',
                field: 'make',
                value: e.target.value,
              })
            }
            className={errors.make ? inputError : inputNormal}
            aria-describedby={errors.make ? `${makeId}-error` : undefined}
            aria-invalid={!!errors.make}
          >
            <option value="">Select make</option>
            {makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          {errors.make && (
            <p
              id={`${makeId}-error`}
              className="text-sm text-[#DC2626] mt-1"
              role="alert"
            >
              {errors.make}
            </p>
          )}
        </div>
      </div>

      {/* Custom make input (when "Other" selected) */}
      {showCustomMake && (
        <div>
          <label
            htmlFor={customMakeId}
            className="block text-sm font-medium text-gray-900 dark:text-[#E0E0E0] mb-1.5"
          >
            Specify Make <span className="text-[#DC2626]">*</span>
          </label>
          <input
            id={customMakeId}
            type="text"
            value={state.make === 'Other' ? '' : state.make}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_FIELD',
                field: 'make',
                value: e.target.value || 'Other',
              })
            }
            placeholder="Enter vehicle make"
            maxLength={50}
            className={inputNormal}
          />
        </div>
      )}

      {/* Model */}
      <div>
        <label
          htmlFor={modelId}
          className="block text-sm font-medium text-gray-900 dark:text-[#E0E0E0] mb-1.5"
        >
          Model{' '}
          <span className="text-gray-400 text-xs font-normal">(optional)</span>
        </label>
        <input
          id={modelId}
          type="text"
          value={state.model}
          onChange={(e) =>
            dispatch({
              type: 'UPDATE_FIELD',
              field: 'model',
              value: e.target.value,
            })
          }
          placeholder="e.g., Camry, Civic, F-150"
          maxLength={50}
          className={inputNormal}
        />
      </div>

      {/* Info callout */}
      <div className="text-sm text-gray-500 dark:text-[#A0A0A0] bg-gray-50 dark:bg-[#1E1E1E] rounded-lg p-3 mt-4">
        We service all domestic and import makes including Toyota, Honda, BMW,
        Mercedes-Benz, Hyundai, Mazda, Subaru, and many more.
      </div>
    </div>
  );
}
