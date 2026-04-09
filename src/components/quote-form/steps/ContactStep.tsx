'use client';

import { useId } from 'react';
import type { QuoteFormData, FormAction } from '../hooks/useQuoteForm';

// ============================================================================
// Types
// ============================================================================

interface ContactStepProps {
  state: QuoteFormData;
  dispatch: React.Dispatch<FormAction>;
  errors: Record<string, string>;
}

// ============================================================================
// Phone Formatter
// ============================================================================

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length >= 7)
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length >= 4) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  if (digits.length > 0) return `(${digits}`;
  return '';
}

// ============================================================================
// Shared input classes
// ============================================================================

const inputBase =
  'h-12 w-full rounded-lg border px-4 text-base transition-colors focus:border-[#C62828] focus:ring-1 focus:ring-[#C62828] focus-visible:ring-2 focus-visible:ring-[#C62828] focus-visible:ring-offset-2';
const inputNormal = `${inputBase} border-gray-300 dark:border-[#444444] bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-[#E0E0E0]`;
const inputError = `${inputBase} border-[#DC2626] bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-[#E0E0E0] animate-shake`;

// ============================================================================
// Contact Method Options
// ============================================================================

const contactMethods: { id: 'phone' | 'text' | 'email'; label: string }[] = [
  { id: 'phone', label: 'Phone' },
  { id: 'text', label: 'Text' },
  { id: 'email', label: 'Email' },
];

// ============================================================================
// Component
// ============================================================================

export function ContactStep({ state, dispatch, errors }: ContactStepProps) {
  const id = useId();
  const firstNameId = `${id}-firstName`;
  const lastNameId = `${id}-lastName`;
  const phoneId = `${id}-phone`;
  const emailId = `${id}-email`;

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    dispatch({ type: 'UPDATE_FIELD', field: 'phone', value: raw });
  }

  return (
    <div className="space-y-4">
      {/* First + Last Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor={firstNameId}
            className="block text-sm font-medium text-gray-900 dark:text-[#E0E0E0] mb-1.5"
          >
            First Name <span className="text-[#DC2626]">*</span>
          </label>
          <input
            id={firstNameId}
            type="text"
            value={state.firstName}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_FIELD',
                field: 'firstName',
                value: e.target.value,
              })
            }
            placeholder="First name"
            maxLength={50}
            className={errors.firstName ? inputError : inputNormal}
            aria-describedby={
              errors.firstName ? `${firstNameId}-error` : undefined
            }
            aria-invalid={!!errors.firstName}
            autoComplete="given-name"
          />
          {errors.firstName && (
            <p
              id={`${firstNameId}-error`}
              className="text-sm text-[#DC2626] mt-1"
              role="alert"
            >
              {errors.firstName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={lastNameId}
            className="block text-sm font-medium text-gray-900 dark:text-[#E0E0E0] mb-1.5"
          >
            Last Name{' '}
            <span className="text-gray-400 text-xs font-normal">
              (optional)
            </span>
          </label>
          <input
            id={lastNameId}
            type="text"
            value={state.lastName}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_FIELD',
                field: 'lastName',
                value: e.target.value,
              })
            }
            placeholder="Last name"
            maxLength={50}
            className={inputNormal}
            autoComplete="family-name"
          />
        </div>
      </div>

      {/* Phone + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor={phoneId}
            className="block text-sm font-medium text-gray-900 dark:text-[#E0E0E0] mb-1.5"
          >
            Phone <span className="text-[#DC2626]">*</span>
          </label>
          <input
            id={phoneId}
            type="tel"
            inputMode="numeric"
            value={formatPhone(state.phone)}
            onChange={handlePhoneChange}
            placeholder="(301) 555-0123"
            className={errors.phone ? inputError : inputNormal}
            aria-describedby={errors.phone ? `${phoneId}-error` : undefined}
            aria-invalid={!!errors.phone}
            autoComplete="tel"
          />
          {errors.phone && (
            <p
              id={`${phoneId}-error`}
              className="text-sm text-[#DC2626] mt-1"
              role="alert"
            >
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={emailId}
            className="block text-sm font-medium text-gray-900 dark:text-[#E0E0E0] mb-1.5"
          >
            Email <span className="text-[#DC2626]">*</span>
          </label>
          <input
            id={emailId}
            type="email"
            inputMode="email"
            value={state.email}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_FIELD',
                field: 'email',
                value: e.target.value,
              })
            }
            placeholder="you@example.com"
            className={errors.email ? inputError : inputNormal}
            aria-describedby={errors.email ? `${emailId}-error` : undefined}
            aria-invalid={!!errors.email}
            autoComplete="email"
          />
          {errors.email && (
            <p
              id={`${emailId}-error`}
              className="text-sm text-[#DC2626] mt-1"
              role="alert"
            >
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Contact Method Toggle */}
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0] mb-2">
          Preferred Contact Method
        </p>
        <div
          className="flex rounded-lg border border-gray-300 dark:border-[#444444] overflow-hidden"
          role="radiogroup"
          aria-label="Preferred contact method"
        >
          {contactMethods.map((method) => {
            const isActive = state.contactMethod === method.id;
            return (
              <button
                key={method.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    field: 'contactMethod',
                    value: method.id,
                  })
                }
                className={`flex-1 h-10 text-sm font-medium transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-[#C62828] focus-visible:ring-offset-2 ${
                  isActive
                    ? 'bg-[#C62828] text-white'
                    : 'bg-white dark:bg-[#1E1E1E] text-gray-700 dark:text-[#A0A0A0] hover:bg-gray-50 dark:hover:bg-[#252525]'
                }`}
              >
                {method.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
