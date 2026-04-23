'use client';

import { useId, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { QuoteFormData, FormAction } from '../hooks/useQuoteForm';
import { useShakeOnError } from '../hooks/useShakeOnError';

interface VehicleStepProps {
  state: QuoteFormData;
  dispatch: React.Dispatch<FormAction>;
  errors: Record<string, string>;
}

const currentYear = new Date().getFullYear();
const years: readonly string[] = Array.from(
  { length: currentYear - 1990 + 1 },
  (_, i) => String(currentYear - i),
);

const makes: readonly string[] = [
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
] as const;

const OTHER_SENTINEL = 'Other';

const fieldBase =
  'h-12 w-full rounded-lg border px-4 text-base bg-background text-foreground placeholder:text-muted-foreground transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const selectBase = `${fieldBase} appearance-none pr-10`;

const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/i;

export function VehicleStep({ state, dispatch, errors }: VehicleStepProps) {
  const t = useTranslations('home.quote.vehicle');
  const reactId = useId();
  const yearId = `${reactId}-year`;
  const makeId = `${reactId}-make`;
  const customMakeId = `${reactId}-custom-make`;
  const modelId = `${reactId}-model`;
  const vinId = `${reactId}-vin`;
  const vinHelperId = `${reactId}-vin-helper`;
  const vinWarningId = `${reactId}-vin-warning`;

  const [vinHelperOpen, setVinHelperOpen] = useState(false);
  const [vinTouched, setVinTouched] = useState(false);
  const vinInvalid =
    vinTouched && state.vin.length > 0 && !VIN_REGEX.test(state.vin);

  const [otherMode, setOtherMode] = useState(
    () =>
      state.make === OTHER_SENTINEL ||
      (state.make !== '' && !makes.includes(state.make)),
  );

  const selectMakeValue = otherMode ? OTHER_SENTINEL : state.make;
  const customMakeValue = state.make === OTHER_SENTINEL ? '' : state.make;

  const yearShake = useShakeOnError(errors.year);
  const makeShake = useShakeOnError(errors.make);

  function handleYearChange(value: string) {
    dispatch({ type: 'UPDATE_FIELD', field: 'year', value });
  }

  function handleMakeSelect(value: string) {
    if (value === OTHER_SENTINEL) {
      setOtherMode(true);
      if (makes.includes(state.make) || state.make === OTHER_SENTINEL) {
        dispatch({ type: 'UPDATE_FIELD', field: 'make', value: '' });
      }
    } else {
      setOtherMode(false);
      dispatch({ type: 'UPDATE_FIELD', field: 'make', value });
    }
  }

  function handleCustomMakeChange(value: string) {
    dispatch({ type: 'UPDATE_FIELD', field: 'make', value });
  }

  function handleModelChange(value: string) {
    dispatch({ type: 'UPDATE_FIELD', field: 'model', value });
  }

  function handleVinChange(value: string) {
    const normalized = value.toUpperCase().replace(/\s+/g, '').slice(0, 17);
    dispatch({ type: 'UPDATE_FIELD', field: 'vin', value: normalized });
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
        <Field id={yearId} label={t('yearLabel')} required error={errors.year}>
          <SelectWithChevron
            id={yearId}
            value={state.year}
            onChange={handleYearChange}
            className={[
              selectBase,
              errors.year ? 'border-destructive' : 'border-input',
              yearShake ? 'animate-shake' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            ariaInvalid={Boolean(errors.year)}
            ariaDescribedBy={errors.year ? `${yearId}-error` : undefined}
          >
            <option value="">{t('yearPlaceholder')}</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </SelectWithChevron>
        </Field>

        <Field id={makeId} label={t('makeLabel')} required error={errors.make}>
          <SelectWithChevron
            id={makeId}
            value={selectMakeValue}
            onChange={handleMakeSelect}
            className={[
              selectBase,
              errors.make ? 'border-destructive' : 'border-input',
              makeShake ? 'animate-shake' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            ariaInvalid={Boolean(errors.make)}
            ariaDescribedBy={errors.make ? `${makeId}-error` : undefined}
          >
            <option value="">{t('makePlaceholder')}</option>
            {makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
            <option value={OTHER_SENTINEL}>{t('makeOther')}</option>
          </SelectWithChevron>
        </Field>
      </div>

      {otherMode && (
        <Field id={customMakeId} label={t('customMakeLabel')} required>
          <input
            id={customMakeId}
            type="text"
            value={customMakeValue}
            onChange={(e) => handleCustomMakeChange(e.target.value)}
            placeholder={t('customMakePlaceholder')}
            maxLength={50}
            autoComplete="off"
            className={`${fieldBase} border-input`}
          />
        </Field>
      )}

      <Field
        id={modelId}
        label={t('modelLabel')}
        optionalHint={t('modelOptional')}
      >
        <input
          id={modelId}
          type="text"
          value={state.model}
          onChange={(e) => handleModelChange(e.target.value)}
          placeholder={t('modelPlaceholder')}
          maxLength={50}
          autoComplete="off"
          className={`${fieldBase} border-input`}
        />
      </Field>

      <div className="border-t border-border pt-5">
        <Field id={vinId} label={t('vinLabel')}>
          <input
            id={vinId}
            type="text"
            inputMode="text"
            value={state.vin}
            onChange={(e) => handleVinChange(e.target.value)}
            onBlur={() => setVinTouched(true)}
            placeholder={t('vinPlaceholder')}
            maxLength={17}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            aria-invalid={vinInvalid || undefined}
            aria-describedby={vinInvalid ? vinWarningId : undefined}
            className={`${fieldBase} font-mono uppercase tracking-wider ${
              vinInvalid ? 'border-amber-500' : 'border-input'
            }`}
          />
        </Field>

        {vinInvalid && (
          <p
            id={vinWarningId}
            role="status"
            className="mt-1.5 flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-500"
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
              <path d="M8 1.5l7 12.5H1z" />
              <path d="M8 6.5v3.5" />
              <path d="M8 12h.01" />
            </svg>
            {t('vinWarning')}
          </p>
        )}

        <button
          type="button"
          onClick={() => setVinHelperOpen((v) => !v)}
          aria-expanded={vinHelperOpen}
          aria-controls={vinHelperId}
          className="mt-2 text-sm font-medium text-red-hover hover:text-primary underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          {t('vinHelperTrigger')}
        </button>

        <div
          id={vinHelperId}
          role="region"
          aria-label={t('vinHelperTitle')}
          style={{ maxHeight: vinHelperOpen ? 400 : 0 }}
          className="overflow-hidden transition-[max-height] duration-[350ms] ease-out"
        >
          <div className="mt-3 rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-medium text-foreground mb-2">
              {t('vinHelperTitle')}
            </p>
            <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-5">
              <li>{t('vinHelperDashboard')}</li>
              <li>{t('vinHelperDoorJamb')}</li>
              <li>{t('vinHelperRegistration')}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-lg bg-muted p-3.5 text-sm text-muted-foreground">
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-hover"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="8" cy="8" r="6.5" />
          <path d="M8 7.5v3.5" />
          <path d="M8 5h.01" />
        </svg>
        <p className="leading-relaxed">{t('callout')}</p>
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

function SelectWithChevron({
  id,
  value,
  onChange,
  className,
  ariaInvalid,
  ariaDescribedBy,
  children,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  className: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
        aria-invalid={ariaInvalid || undefined}
        aria-describedby={ariaDescribedBy}
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 6l4 4 4-4" />
      </svg>
    </div>
  );
}
