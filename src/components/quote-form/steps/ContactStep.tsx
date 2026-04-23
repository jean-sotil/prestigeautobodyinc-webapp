'use client';

import { useId, useRef } from 'react';
import { useTranslations } from 'next-intl';
import type { QuoteFormData, FormAction } from '../hooks/useQuoteForm';
import { useShakeOnError } from '../hooks/useShakeOnError';

interface ContactStepProps {
  state: QuoteFormData;
  dispatch: React.Dispatch<FormAction>;
  errors: Record<string, string>;
}

type ContactMethod = 'phone' | 'text' | 'email';
const methodOrder: readonly ContactMethod[] = [
  'phone',
  'text',
  'email',
] as const;

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length >= 7)
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length >= 4) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  if (digits.length > 0) return `(${digits}`;
  return '';
}

const fieldBase =
  'h-12 w-full rounded-lg border px-4 text-base bg-background text-foreground placeholder:text-muted-foreground transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export function ContactStep({ state, dispatch, errors }: ContactStepProps) {
  const t = useTranslations('home.quote.contact');
  const reactId = useId();
  const firstNameId = `${reactId}-firstName`;
  const lastNameId = `${reactId}-lastName`;
  const phoneId = `${reactId}-phone`;
  const emailId = `${reactId}-email`;

  const firstNameShake = useShakeOnError(errors.firstName);
  const phoneShake = useShakeOnError(errors.phone);
  const emailShake = useShakeOnError(errors.email);

  const methodRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeMethodIdx = methodOrder.indexOf(
    state.contactMethod as ContactMethod,
  );

  function setMethod(id: ContactMethod) {
    dispatch({ type: 'UPDATE_FIELD', field: 'contactMethod', value: id });
  }

  function handleMethodKey(
    event: React.KeyboardEvent<HTMLButtonElement>,
    idx: number,
  ) {
    let nextIdx = idx;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIdx = (idx + 1) % methodOrder.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIdx = (idx - 1 + methodOrder.length) % methodOrder.length;
        break;
      case 'Home':
        nextIdx = 0;
        break;
      case 'End':
        nextIdx = methodOrder.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const next = methodOrder[nextIdx];
    setMethod(next);
    methodRefs.current[nextIdx]?.focus();
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    dispatch({ type: 'UPDATE_FIELD', field: 'phone', value: raw });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-base md:text-lg font-medium text-foreground">
          {t('prompt')}
        </p>
        <span className="text-xs text-muted-foreground" aria-hidden="true">
          {t('required')}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          id={firstNameId}
          label={t('firstNameLabel')}
          required
          error={errors.firstName}
        >
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
            placeholder={t('firstNamePlaceholder')}
            maxLength={50}
            autoComplete="given-name"
            aria-invalid={errors.firstName ? true : undefined}
            aria-describedby={
              errors.firstName ? `${firstNameId}-error` : undefined
            }
            className={[
              fieldBase,
              errors.firstName ? 'border-destructive' : 'border-input',
              firstNameShake ? 'animate-shake' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          />
        </Field>

        <Field
          id={lastNameId}
          label={t('lastNameLabel')}
          optionalHint={t('lastNameOptional')}
        >
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
            placeholder={t('lastNamePlaceholder')}
            maxLength={50}
            autoComplete="family-name"
            className={`${fieldBase} border-input`}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          id={phoneId}
          label={t('phoneLabel')}
          required
          error={errors.phone}
        >
          <input
            id={phoneId}
            type="tel"
            inputMode="numeric"
            value={formatPhone(state.phone)}
            onChange={handlePhoneChange}
            placeholder={t('phonePlaceholder')}
            autoComplete="tel"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? `${phoneId}-error` : undefined}
            className={[
              fieldBase,
              'tabular-nums',
              errors.phone ? 'border-destructive' : 'border-input',
              phoneShake ? 'animate-shake' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          />
        </Field>

        <Field
          id={emailId}
          label={t('emailLabel')}
          required
          error={errors.email}
        >
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
            placeholder={t('emailPlaceholder')}
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? `${emailId}-error` : undefined}
            className={[
              fieldBase,
              errors.email ? 'border-destructive' : 'border-input',
              emailShake ? 'animate-shake' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          />
        </Field>
      </div>

      <div>
        <p
          id="contact-method-label"
          className="text-sm font-medium text-foreground mb-2"
        >
          {t('methodLabel')}
        </p>
        <div
          role="radiogroup"
          aria-labelledby="contact-method-label"
          className="flex overflow-hidden rounded-lg border border-border bg-card"
        >
          {methodOrder.map((id, idx) => {
            const isActive = state.contactMethod === id;
            const isLast = idx === methodOrder.length - 1;
            const isTabStop =
              idx === (activeMethodIdx >= 0 ? activeMethodIdx : 0);
            return (
              <button
                key={id}
                ref={(el) => {
                  methodRefs.current[idx] = el;
                }}
                type="button"
                role="radio"
                aria-checked={isActive}
                tabIndex={isTabStop ? 0 : -1}
                onClick={() => setMethod(id)}
                onKeyDown={(e) => handleMethodKey(e, idx)}
                className={[
                  'flex-1 h-11 text-sm font-medium transition-colors duration-150 relative',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:z-10',
                  !isLast ? 'border-r border-border' : '',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-inner'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {t(`method.${id}`)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  required,
  optionalHint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optionalHint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-foreground mb-1.5"
      >
        {label}
        {required && (
          <span className="text-destructive ml-0.5" aria-hidden="true">
            ∗
          </span>
        )}
        {optionalHint && (
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            {optionalHint}
          </span>
        )}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 text-sm text-destructive"
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
          {error}
        </p>
      )}
    </div>
  );
}
