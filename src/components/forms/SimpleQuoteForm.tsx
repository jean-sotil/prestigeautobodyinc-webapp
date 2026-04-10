'use client';

import React, {
  useReducer,
  useEffect,
  useCallback,
  useState,
  useRef,
} from 'react';
import { useTranslations } from 'next-intl';
import { LegacyButton as Button } from '@/components/ui/Button';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface SimpleQuoteFormData {
  // Step 1: Service Selection
  service: 'collision' | 'autobody' | 'painting' | 'insurance' | '';

  // Step 2: Vehicle Information
  year: string;
  make: string;
  customMake: string;
  model: string;

  // Step 3: Damage Details
  severity: 'minor' | 'moderate' | 'major' | 'unsure' | '';
  damageDescription: string;
  hasPhotos: boolean;

  // Step 4: Contact Information
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  contactMethod: 'phone' | 'text' | 'email';
}

export interface SimpleQuoteFormState {
  data: SimpleQuoteFormData;
  currentStep: number;
  isSubmitting: boolean;
  isSubmitted: boolean;
  errors: Partial<Record<keyof SimpleQuoteFormData, string>>;
}

export type SimpleQuoteFormAction =
  | {
      type: 'UPDATE_FIELD';
      field: keyof SimpleQuoteFormData;
      value: string | boolean;
    }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; step: number }
  | { type: 'SET_ERROR'; field: keyof SimpleQuoteFormData; error: string }
  | { type: 'CLEAR_ERROR'; field: keyof SimpleQuoteFormData }
  | { type: 'CLEAR_ALL_ERRORS' }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'SET_SUBMITTED'; isSubmitted: boolean }
  | { type: 'RESET' };

// ============================================================================
// Constants
// ============================================================================

const TOTAL_STEPS = 4;
const LOCALSTORAGE_KEY = 'prestige-simple-quote-draft';

// Predefined vehicle makes (17 standard + Other)
const VEHICLE_MAKES = [
  'Acura',
  'BMW',
  'Chevrolet',
  'Dodge',
  'Ford',
  'Honda',
  'Hyundai',
  'Jeep',
  'Kia',
  'Lexus',
  'Mazda',
  'Mercedes-Benz',
  'Nissan',
  'Subaru',
  'Tesla',
  'Toyota',
  'Volkswagen',
];

const INITIAL_DATA: SimpleQuoteFormData = {
  service: '',
  year: '',
  make: '',
  customMake: '',
  model: '',
  severity: '',
  damageDescription: '',
  hasPhotos: false,
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  contactMethod: 'phone',
};

const INITIAL_STATE: SimpleQuoteFormState = {
  data: INITIAL_DATA,
  currentStep: 1,
  isSubmitting: false,
  isSubmitted: false,
  errors: {},
};

// ============================================================================
// Reducer
// ============================================================================

function simpleQuoteFormReducer(
  state: SimpleQuoteFormState,
  action: SimpleQuoteFormAction,
): SimpleQuoteFormState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        data: { ...state.data, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: undefined },
      };
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, TOTAL_STEPS),
      };
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1) };
    case 'GO_TO_STEP':
      return {
        ...state,
        currentStep: Math.max(1, Math.min(action.step, TOTAL_STEPS)),
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: undefined },
      };
    case 'CLEAR_ALL_ERRORS':
      return { ...state, errors: {} };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.isSubmitting };
    case 'SET_SUBMITTED':
      return { ...state, isSubmitted: action.isSubmitted };
    case 'RESET':
      return INITIAL_STATE;
    default:
      return state;
  }
}

// ============================================================================
// Validation
// ============================================================================

const STEP_REQUIRED_FIELDS: Record<number, (keyof SimpleQuoteFormData)[]> = {
  1: ['service'],
  2: ['year', 'make', 'model'],
  3: ['severity'],
  4: ['firstName', 'lastName', 'phone', 'email'],
};

function validateStep(
  step: number,
  data: SimpleQuoteFormData,
): Partial<Record<keyof SimpleQuoteFormData, string>> {
  const errors: Partial<Record<keyof SimpleQuoteFormData, string>> = {};
  const requiredFields = STEP_REQUIRED_FIELDS[step] || [];

  requiredFields.forEach((field) => {
    const value = data[field];
    if (typeof value === 'string' && value.trim() === '') {
      errors[field] = 'This field is required';
    } else if (typeof value === 'boolean' && !value && field !== 'hasPhotos') {
      errors[field] = 'This field is required';
    }
  });

  // Email validation
  if (
    step === 4 &&
    data.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
  ) {
    errors.email = 'Please enter a valid email address';
  }

  return errors;
}

// ============================================================================
// Phone Formatting Helper
// ============================================================================

function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length === 0) return '';
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6)
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
}

// ============================================================================
// Custom Hooks
// ============================================================================

function useDebouncedLocalStorage(
  state: SimpleQuoteFormState,
  key: string,
  delay: number = 500,
): void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>('');

  useEffect(() => {
    if (state.isSubmitted) return;

    const dataToSave = {
      data: state.data,
      currentStep: state.currentStep,
      savedAt: new Date().toISOString(),
    };

    const serialized = JSON.stringify(dataToSave);
    if (serialized === lastSavedRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, serialized);
        lastSavedRef.current = serialized;
      } catch (error) {
        console.warn('Failed to save quote draft:', error);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [state.data, state.currentStep, state.isSubmitted, key, delay]);
}

function useHydrateFromLocalStorage(
  dispatch: React.Dispatch<SimpleQuoteFormAction>,
  key: string,
): boolean {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.data) {
          Object.entries(parsed.data).forEach(([field, value]) => {
            dispatch({
              type: 'UPDATE_FIELD',
              field: field as keyof SimpleQuoteFormData,
              value: value as string | boolean,
            });
          });
        }
        if (parsed.currentStep) {
          dispatch({ type: 'GO_TO_STEP', step: parsed.currentStep });
        }
      }
    } catch (error) {
      console.warn('Failed to hydrate from localStorage:', error);
    }
    setIsHydrated(true);
  }, [dispatch, key]);

  return isHydrated;
}

// ============================================================================
// Step Components
// ============================================================================

function StepService({
  data,
  dispatch,
  errors,
  t,
}: {
  data: SimpleQuoteFormData;
  dispatch: React.Dispatch<SimpleQuoteFormAction>;
  errors: SimpleQuoteFormState['errors'];
  t: (key: string) => string;
}) {
  const services = [
    {
      id: 'collision',
      icon: '🔧',
      title: t('services.collision'),
      description: t('services.collisionDesc'),
    },
    {
      id: 'autobody',
      icon: '🛠️',
      title: t('services.autobody'),
      description: t('services.autobodyDesc'),
    },
    {
      id: 'painting',
      icon: '🎨',
      title: t('services.painting'),
      description: t('services.paintingDesc'),
    },
    {
      id: 'insurance',
      icon: '📋',
      title: t('services.insurance'),
      description: t('services.insuranceDesc'),
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        {t('step1.title')}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{t('step1.subtitle')}</p>

      <div
        className="grid grid-cols-2 gap-4"
        role="radiogroup"
        aria-label={t('step1.title')}
      >
        {services.map((service) => (
          <button
            key={service.id}
            type="button"
            onClick={() =>
              dispatch({
                type: 'UPDATE_FIELD',
                field: 'service',
                value: service.id as SimpleQuoteFormData['service'],
              })
            }
            role="radio"
            aria-checked={data.service === service.id}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              data.service === service.id
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700'
            }`}
          >
            <div className="text-3xl mb-2">{service.icon}</div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {service.title}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {service.description}
            </p>
          </button>
        ))}
      </div>

      {errors.service && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {errors.service}
        </p>
      )}
    </div>
  );
}

function StepVehicle({
  data,
  dispatch,
  errors,
  t,
}: {
  data: SimpleQuoteFormData;
  dispatch: React.Dispatch<SimpleQuoteFormAction>;
  errors: SimpleQuoteFormState['errors'];
  t: (key: string) => string;
}) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 31 }, (_, i) =>
    (currentYear - i).toString(),
  );

  const updateField = useCallback(
    (field: keyof SimpleQuoteFormData, value: string) => {
      dispatch({ type: 'UPDATE_FIELD', field, value });
    },
    [dispatch],
  );

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        {t('step2.title')}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{t('step2.subtitle')}</p>

      <div>
        <label
          htmlFor="year"
          className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
        >
          {t('step2.year')} *
        </label>
        <select
          id="year"
          value={data.year}
          onChange={(e) => updateField('year', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          aria-invalid={errors.year ? 'true' : 'false'}
          aria-describedby={errors.year ? 'year-error' : undefined}
        >
          <option value="">{t('step2.selectYear')}</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        {errors.year && (
          <p
            id="year-error"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {errors.year}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="make"
          className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
        >
          {t('step2.make')} *
        </label>
        <select
          id="make"
          value={data.make}
          onChange={(e) => updateField('make', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          aria-invalid={errors.make ? 'true' : 'false'}
          aria-describedby={errors.make ? 'make-error' : undefined}
        >
          <option value="">{t('step2.selectMake')}</option>
          {VEHICLE_MAKES.map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
          <option value="Other">{t('step2.other')}</option>
        </select>
        {errors.make && (
          <p
            id="make-error"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {errors.make}
          </p>
        )}
      </div>

      {data.make === 'Other' && (
        <div>
          <label
            htmlFor="customMake"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            {t('step2.customMake')} *
          </label>
          <input
            type="text"
            id="customMake"
            value={data.customMake}
            onChange={(e) => updateField('customMake', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            placeholder={t('step2.customMakePlaceholder')}
          />
        </div>
      )}

      <div>
        <label
          htmlFor="model"
          className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
        >
          {t('step2.model')} *
        </label>
        <input
          type="text"
          id="model"
          value={data.model}
          onChange={(e) => updateField('model', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          placeholder={t('step2.modelPlaceholder')}
          aria-invalid={errors.model ? 'true' : 'false'}
          aria-describedby={errors.model ? 'model-error' : undefined}
        />
        {errors.model && (
          <p
            id="model-error"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {errors.model}
          </p>
        )}
      </div>
    </div>
  );
}

function StepDamage({
  data,
  dispatch,
  errors,
  t,
}: {
  data: SimpleQuoteFormData;
  dispatch: React.Dispatch<SimpleQuoteFormAction>;
  errors: SimpleQuoteFormState['errors'];
  t: (key: string) => string;
}) {
  const severities = [
    {
      id: 'minor',
      color: 'bg-yellow-400',
      borderColor: 'border-yellow-400',
      title: t('step3.minor'),
      description: t('step3.minorDesc'),
    },
    {
      id: 'moderate',
      color: 'bg-orange-400',
      borderColor: 'border-orange-400',
      title: t('step3.moderate'),
      description: t('step3.moderateDesc'),
    },
    {
      id: 'major',
      color: 'bg-red-500',
      borderColor: 'border-red-500',
      title: t('step3.major'),
      description: t('step3.majorDesc'),
    },
    {
      id: 'unsure',
      color: 'bg-gray-400',
      borderColor: 'border-gray-400',
      title: t('step3.unsure'),
      description: t('step3.unsureDesc'),
    },
  ];

  const updateField = useCallback(
    (field: keyof SimpleQuoteFormData, value: string | boolean) => {
      dispatch({ type: 'UPDATE_FIELD', field, value });
    },
    [dispatch],
  );

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        {t('step3.title')}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{t('step3.subtitle')}</p>

      <div
        className="grid grid-cols-2 gap-4"
        role="radiogroup"
        aria-label={t('step3.severityLabel')}
      >
        {severities.map((sev) => (
          <button
            key={sev.id}
            type="button"
            onClick={() =>
              dispatch({
                type: 'UPDATE_FIELD',
                field: 'severity',
                value: sev.id as SimpleQuoteFormData['severity'],
              })
            }
            role="radio"
            aria-checked={data.severity === sev.id}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              data.severity === sev.id
                ? `border-red-500 bg-red-50 dark:bg-red-900/20`
                : 'border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`w-3 h-3 rounded-full ${sev.color}`}
                aria-hidden="true"
              />
              <span className="font-semibold text-gray-900 dark:text-white">
                {sev.title}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {sev.description}
            </p>
          </button>
        ))}
      </div>

      {errors.severity && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {errors.severity}
        </p>
      )}

      <div>
        <label
          htmlFor="damageDescription"
          className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
        >
          {t('step3.description')}
        </label>
        <textarea
          id="damageDescription"
          rows={4}
          value={data.damageDescription}
          onChange={(e) => updateField('damageDescription', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-y"
          placeholder={t('step3.descriptionPlaceholder')}
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="hasPhotos"
          checked={data.hasPhotos}
          onChange={(e) => updateField('hasPhotos', e.target.checked)}
          className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
        />
        <label
          htmlFor="hasPhotos"
          className="text-sm text-gray-700 dark:text-gray-300"
        >
          {t('step3.hasPhotos')}
        </label>
      </div>
    </div>
  );
}

function StepContact({
  data,
  dispatch,
  errors,
  t,
}: {
  data: SimpleQuoteFormData;
  dispatch: React.Dispatch<SimpleQuoteFormAction>;
  errors: SimpleQuoteFormState['errors'];
  t: (key: string) => string;
}) {
  const updateField = useCallback(
    (field: keyof SimpleQuoteFormData, value: string) => {
      dispatch({ type: 'UPDATE_FIELD', field, value });
    },
    [dispatch],
  );

  const handlePhoneBlur = useCallback(() => {
    const formatted = formatPhoneNumber(data.phone);
    updateField('phone', formatted);
  }, [data.phone, updateField]);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        {t('step4.title')}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{t('step4.subtitle')}</p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            {t('step4.firstName')} *
          </label>
          <input
            type="text"
            id="firstName"
            value={data.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            aria-invalid={errors.firstName ? 'true' : 'false'}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
          />
          {errors.firstName && (
            <p
              id="firstName-error"
              className="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              {errors.firstName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            {t('step4.lastName')} *
          </label>
          <input
            type="text"
            id="lastName"
            value={data.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            aria-invalid={errors.lastName ? 'true' : 'false'}
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
          />
          {errors.lastName && (
            <p
              id="lastName-error"
              className="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
        >
          {t('step4.phone')} *
        </label>
        <input
          type="tel"
          id="phone"
          inputMode="tel"
          value={data.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          onBlur={handlePhoneBlur}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          placeholder="(301) 578-8779"
          aria-invalid={errors.phone ? 'true' : 'false'}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
        />
        {errors.phone && (
          <p
            id="phone-error"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {errors.phone}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
        >
          {t('step4.email')} *
        </label>
        <input
          type="email"
          id="email"
          value={data.email}
          onChange={(e) => updateField('email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p
            id="email-error"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          {t('step4.contactMethod')}
        </label>
        <div
          className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg"
          role="radiogroup"
          aria-label={t('step4.contactMethod')}
        >
          {(['phone', 'text', 'email'] as const).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => updateField('contactMethod', method)}
              role="radio"
              aria-checked={data.contactMethod === method}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                data.contactMethod === method
                  ? 'bg-white dark:bg-gray-700 text-red-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {t(`step4.methods.${method}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function SimpleQuoteForm() {
  const [state, dispatch] = useReducer(simpleQuoteFormReducer, INITIAL_STATE);
  const t = useTranslations('simpleQuoteForm');
  const isHydrated = useHydrateFromLocalStorage(dispatch, LOCALSTORAGE_KEY);
  const stepContentRef = useRef<HTMLDivElement>(null);

  useDebouncedLocalStorage(state, LOCALSTORAGE_KEY, 500);

  // Focus management
  useEffect(() => {
    if (isHydrated && stepContentRef.current) {
      const firstInput = stepContentRef.current.querySelector(
        'input, select, textarea',
      ) as HTMLElement;
      if (firstInput) {
        firstInput.focus();
      }
    }
  }, [state.currentStep, isHydrated]);

  const handleNext = useCallback(() => {
    const errors = validateStep(state.currentStep, state.data);

    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, error]) => {
        if (error) {
          dispatch({
            type: 'SET_ERROR',
            field: field as keyof SimpleQuoteFormData,
            error,
          });
        }
      });
      return;
    }

    if (state.currentStep < TOTAL_STEPS) {
      dispatch({ type: 'NEXT_STEP' });
    }
  }, [state.currentStep, state.data]);

  const handlePrev = useCallback(() => {
    if (state.currentStep > 1) {
      dispatch({ type: 'PREV_STEP' });
    }
  }, [state.currentStep]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const errors = validateStep(state.currentStep, state.data);
      if (Object.keys(errors).length > 0) {
        Object.entries(errors).forEach(([field, error]) => {
          if (error) {
            dispatch({
              type: 'SET_ERROR',
              field: field as keyof SimpleQuoteFormData,
              error,
            });
          }
        });
        return;
      }

      dispatch({ type: 'SET_SUBMITTING', isSubmitting: true });

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Clear localStorage draft on successful submission
        localStorage.removeItem(LOCALSTORAGE_KEY);

        dispatch({ type: 'SET_SUBMITTED', isSubmitted: true });
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        dispatch({ type: 'SET_SUBMITTING', isSubmitting: false });
      }
    },
    [state.currentStep, state.data],
  );

  const handleReset = useCallback(() => {
    localStorage.removeItem(LOCALSTORAGE_KEY);
    dispatch({ type: 'RESET' });
  }, []);

  // Success state
  if (state.isSubmitted) {
    return (
      <div className="max-w-lg mx-auto p-8 bg-green-50 dark:bg-green-900/20 rounded-xl text-center shadow-md">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
          {t('success.title')}
        </h3>
        <p className="text-green-700 dark:text-green-300 mb-4">
          {t('success.message', { name: state.data.firstName })}
        </p>
        <p className="text-sm text-green-600 dark:text-green-400 mb-6">
          {t('success.followUp')}
        </p>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {t('success.requestAnother')}
        </button>
      </div>
    );
  }

  const stepComponents = [
    null,
    StepService,
    StepVehicle,
    StepDamage,
    StepContact,
  ];
  const CurrentStepComponent = stepComponents[state.currentStep];

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto"
      aria-label={t('formLabel')}
    >
      {/* Step Indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400">
            <span aria-live="polite">
              {t('stepIndicator', {
                current: state.currentStep,
                total: TOTAL_STEPS,
              })}
            </span>
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            {Math.round((state.currentStep / TOTAL_STEPS) * 100)}%{' '}
            {t('complete')}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-red-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(state.currentStep / TOTAL_STEPS) * 100}%` }}
            aria-valuenow={state.currentStep}
            aria-valuemin={1}
            aria-valuemax={TOTAL_STEPS}
            role="progressbar"
            aria-label={t('progressLabel')}
          />
        </div>

        {/* Step Dots */}
        <div className="flex justify-between mt-3 px-1">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
            <button
              key={step}
              type="button"
              onClick={() => {
                if (step < state.currentStep) {
                  dispatch({ type: 'GO_TO_STEP', step });
                }
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                step === state.currentStep
                  ? 'bg-red-600 scale-125'
                  : step < state.currentStep
                    ? 'bg-red-400 hover:bg-red-500 cursor-pointer'
                    : 'bg-gray-300 dark:bg-gray-600'
              }`}
              aria-label={t('goToStep', { step })}
              aria-current={step === state.currentStep ? 'step' : undefined}
              disabled={step >= state.currentStep}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div
        ref={stepContentRef}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
      >
        {CurrentStepComponent && (
          <CurrentStepComponent
            data={state.data}
            dispatch={dispatch}
            errors={state.errors}
            t={t}
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          {state.currentStep > 1 && (
            <Button
              variant="secondary"
              size="md"
              onClick={handlePrev}
              className="flex-1"
            >
              {t('buttons.back')}
            </Button>
          )}

          {state.currentStep < TOTAL_STEPS ? (
            <Button
              variant="primary"
              size="md"
              onClick={handleNext}
              className="flex-1"
            >
              {t('buttons.next')}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={state.isSubmitting}
              className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.isSubmitting
                ? t('buttons.submitting')
                : t('buttons.submit')}
            </Button>
          )}
        </div>
      </div>

      {/* Draft Saved Indicator */}
      {!state.isSubmitted && isHydrated && (
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
          {t('draftSaved')}
        </p>
      )}
    </form>
  );
}

export { simpleQuoteFormReducer, INITIAL_STATE, INITIAL_DATA, TOTAL_STEPS };
export default SimpleQuoteForm;
