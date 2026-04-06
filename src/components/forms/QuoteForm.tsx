'use client';

import React, {
  useReducer,
  useEffect,
  useRef,
  useCallback,
  useState,
} from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface QuoteFormData {
  // Step 1: Contact Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredContact: 'phone' | 'email' | 'text';

  // Step 2: Vehicle Information
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleVin: string;
  licensePlate: string;
  mileage: string;

  // Step 3: Incident Details
  incidentDate: string;
  incidentLocation: string;
  incidentDescription: string;
  drivable: 'yes' | 'no' | 'unknown';

  // Step 4: Damage Assessment
  damageAreas: string[];
  hasPhotos: 'yes' | 'no';
  photoDescription: string;

  // Step 5: Insurance Information
  insuranceCompany: string;
  policyNumber: string;
  claimNumber: string;
  deductible: string;
  hasClaim: 'yes' | 'no' | 'pending';

  // Step 6: Scheduling (enhanced)
  appointmentDate: string;
  appointmentTime: string;
  schedulingNotes: string;
  skipScheduling: boolean;

  // Legacy fields (for backward compatibility with drafts)
  preferredDate: string;
  preferredTime: 'morning' | 'afternoon' | 'evening';
  alternateDate: string;
  needsRental: 'yes' | 'no';
  additionalNotes: string;
}

export interface QuoteFormState {
  data: QuoteFormData;
  currentStep: number;
  direction: 'forward' | 'backward' | null;
  isSubmitting: boolean;
  isSubmitted: boolean;
  errors: Partial<Record<keyof QuoteFormData, string>>;
}

export type QuoteFormAction =
  | {
      type: 'UPDATE_FIELD';
      field: keyof QuoteFormData;
      value: string | string[] | boolean;
    }
  | { type: 'UPDATE_MULTIPLE_FIELDS'; fields: Partial<QuoteFormData> }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; step: number }
  | { type: 'SET_DIRECTION'; direction: 'forward' | 'backward' | null }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'SET_SUBMITTED'; isSubmitted: boolean }
  | { type: 'SET_ERROR'; field: keyof QuoteFormData; error: string }
  | { type: 'CLEAR_ERROR'; field: keyof QuoteFormData }
  | { type: 'CLEAR_ALL_ERRORS' }
  | { type: 'RESET' }
  | { type: 'HYDRATE'; data: Partial<QuoteFormData>; currentStep: number };

// ============================================================================
// Constants
// ============================================================================

const TOTAL_STEPS = 7;

const LOCALSTORAGE_KEY = 'prestige-quote-draft';

const INITIAL_DATA: QuoteFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  preferredContact: 'phone',
  vehicleYear: '',
  vehicleMake: '',
  vehicleModel: '',
  vehicleVin: '',
  licensePlate: '',
  mileage: '',
  incidentDate: '',
  incidentLocation: '',
  incidentDescription: '',
  drivable: 'unknown',
  damageAreas: [],
  hasPhotos: 'no',
  photoDescription: '',
  insuranceCompany: '',
  policyNumber: '',
  claimNumber: '',
  deductible: '',
  hasClaim: 'pending',
  // New enhanced scheduling fields
  appointmentDate: '',
  appointmentTime: '',
  schedulingNotes: '',
  skipScheduling: false,
  // Legacy fields
  preferredDate: '',
  preferredTime: 'morning',
  alternateDate: '',
  needsRental: 'no',
  additionalNotes: '',
};

const INITIAL_STATE: QuoteFormState = {
  data: INITIAL_DATA,
  currentStep: 1,
  direction: null,
  isSubmitting: false,
  isSubmitted: false,
  errors: {},
};

// ============================================================================
// Reducer
// ============================================================================

function quoteFormReducer(
  state: QuoteFormState,
  action: QuoteFormAction,
): QuoteFormState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        data: { ...state.data, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: undefined },
      };

    case 'UPDATE_MULTIPLE_FIELDS':
      return {
        ...state,
        data: { ...state.data, ...action.fields },
      };

    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, TOTAL_STEPS),
        direction: 'forward',
      };

    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1),
        direction: 'backward',
      };

    case 'GO_TO_STEP':
      return {
        ...state,
        currentStep: Math.max(1, Math.min(action.step, TOTAL_STEPS)),
        direction: action.step > state.currentStep ? 'forward' : 'backward',
      };

    case 'SET_DIRECTION':
      return { ...state, direction: action.direction };

    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.isSubmitting };

    case 'SET_SUBMITTED':
      return { ...state, isSubmitted: action.isSubmitted };

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

    case 'RESET':
      return INITIAL_STATE;

    case 'HYDRATE':
      return {
        ...state,
        data: { ...state.data, ...action.data },
        currentStep: action.currentStep,
      };

    default:
      return state;
  }
}

// ============================================================================
// Custom Hooks
// ============================================================================

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

function useDebouncedLocalStorage(
  state: QuoteFormState,
  key: string,
  delay: number = 500,
): void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>('');

  useEffect(() => {
    // Don't save if form is submitted or empty
    if (state.isSubmitted) return;

    const dataToSave = {
      data: state.data,
      currentStep: state.currentStep,
      savedAt: new Date().toISOString(),
    };

    const serialized = JSON.stringify(dataToSave);

    // Skip if nothing changed
    if (serialized === lastSavedRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, serialized);
        lastSavedRef.current = serialized;
      } catch (error) {
        console.warn('Failed to save quote form draft:', error);
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
  dispatch: React.Dispatch<QuoteFormAction>,
  key: string,
): boolean {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({
          type: 'HYDRATE',
          data: parsed.data || {},
          currentStep: parsed.currentStep || 1,
        });
      }
    } catch (error) {
      console.warn('Failed to hydrate quote form from localStorage:', error);
    }
    setIsHydrated(true);
  }, [dispatch, key]);

  return isHydrated;
}

// ============================================================================
// Validation
// ============================================================================

const STEP_REQUIRED_FIELDS: Record<number, (keyof QuoteFormData)[]> = {
  1: ['firstName', 'lastName', 'email', 'phone'],
  2: ['vehicleYear', 'vehicleMake', 'vehicleModel'],
  3: ['incidentDescription'],
  4: ['damageAreas'],
  5: [],
  6: [], // Scheduling is optional (can skip)
  7: [], // Confirmation step
};

function validateStep(
  step: number,
  data: QuoteFormData,
): Partial<Record<keyof QuoteFormData, string>> {
  const errors: Partial<Record<keyof QuoteFormData, string>> = {};
  const requiredFields = STEP_REQUIRED_FIELDS[step] || [];

  requiredFields.forEach((field) => {
    const value = data[field];
    if (Array.isArray(value)) {
      if (value.length === 0) {
        errors[field] = 'This field is required';
      }
    } else if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors[field] = 'This field is required';
    }
  });

  // Email validation
  if (
    step === 1 &&
    data.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
  ) {
    errors.email = 'Please enter a valid email address';
  }

  // Phone validation
  if (
    step === 1 &&
    data.phone &&
    !/^[\d\s\-\(\)\+]{10,}$/.test(data.phone.replace(/\D/g, ''))
  ) {
    errors.phone = 'Please enter a valid phone number';
  }

  return errors;
}

// ============================================================================
// Form Step Components
// ============================================================================

function StepContactInfo({
  data,
  dispatch,
  errors,
  t,
}: {
  data: QuoteFormData;
  dispatch: React.Dispatch<QuoteFormAction>;
  errors: QuoteFormState['errors'];
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const updateField = useCallback(
    (field: keyof QuoteFormData, value: string) => {
      dispatch({ type: 'UPDATE_FIELD', field, value });
    },
    [dispatch],
  );

  return (
    <div
      className="space-y-4"
      role="tabpanel"
      aria-label={t('steps.contact.title')}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {t('steps.contact.title')}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            {t('steps.contact.firstName')} *
          </label>
          <input
            type="text"
            id="firstName"
            required
            value={data.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
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
            {t('steps.contact.lastName')} *
          </label>
          <input
            type="text"
            id="lastName"
            required
            value={data.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
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
          htmlFor="email"
          className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
        >
          {t('steps.contact.email')} *
        </label>
        <input
          type="email"
          id="email"
          required
          value={data.email}
          onChange={(e) => updateField('email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
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
        <label
          htmlFor="phone"
          className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
        >
          {t('steps.contact.phone')} *
        </label>
        <input
          type="tel"
          id="phone"
          required
          value={data.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
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
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          {t('steps.contact.preferredContact')}
        </label>
        <div className="flex flex-wrap gap-3">
          {(['phone', 'email', 'text'] as const).map((method) => (
            <label key={method} className="flex items-center">
              <input
                type="radio"
                name="preferredContact"
                value={method}
                checked={data.preferredContact === method}
                onChange={(e) =>
                  updateField('preferredContact', e.target.value)
                }
                className="mr-2 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {t(`steps.contact.methods.${method}`)}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepVehicleInfo({
  data,
  dispatch,
  errors,
  t,
}: {
  data: QuoteFormData;
  dispatch: React.Dispatch<QuoteFormAction>;
  errors: QuoteFormState['errors'];
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const updateField = useCallback(
    (field: keyof QuoteFormData, value: string) => {
      dispatch({ type: 'UPDATE_FIELD', field, value });
    },
    [dispatch],
  );

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 35 }, (_, i) =>
    (currentYear - i).toString(),
  );

  return (
    <div
      className="space-y-4"
      role="tabpanel"
      aria-label={t('steps.vehicle.title')}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {t('steps.vehicle.title')}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="vehicleYear"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            {t('steps.vehicle.year')} *
          </label>
          <select
            id="vehicleYear"
            required
            value={data.vehicleYear}
            onChange={(e) => updateField('vehicleYear', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            aria-invalid={errors.vehicleYear ? 'true' : 'false'}
            aria-describedby={
              errors.vehicleYear ? 'vehicleYear-error' : undefined
            }
          >
            <option value="">{t('steps.vehicle.selectYear')}</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {errors.vehicleYear && (
            <p
              id="vehicleYear-error"
              className="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              {errors.vehicleYear}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="vehicleMake"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            {t('steps.vehicle.make')} *
          </label>
          <input
            type="text"
            id="vehicleMake"
            required
            value={data.vehicleMake}
            onChange={(e) => updateField('vehicleMake', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            placeholder={t('steps.vehicle.makePlaceholder')}
            aria-invalid={errors.vehicleMake ? 'true' : 'false'}
            aria-describedby={
              errors.vehicleMake ? 'vehicleMake-error' : undefined
            }
          />
          {errors.vehicleMake && (
            <p
              id="vehicleMake-error"
              className="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              {errors.vehicleMake}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="vehicleModel"
          className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
        >
          {t('steps.vehicle.model')} *
        </label>
        <input
          type="text"
          id="vehicleModel"
          required
          value={data.vehicleModel}
          onChange={(e) => updateField('vehicleModel', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          placeholder={t('steps.vehicle.modelPlaceholder')}
          aria-invalid={errors.vehicleModel ? 'true' : 'false'}
          aria-describedby={
            errors.vehicleModel ? 'vehicleModel-error' : undefined
          }
        />
        {errors.vehicleModel && (
          <p
            id="vehicleModel-error"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {errors.vehicleModel}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="vehicleVin"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            {t('steps.vehicle.vin')}
          </label>
          <input
            type="text"
            id="vehicleVin"
            value={data.vehicleVin}
            onChange={(e) =>
              updateField('vehicleVin', e.target.value.toUpperCase())
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            placeholder="1HGBH41JXMN109186"
            maxLength={17}
          />
        </div>

        <div>
          <label
            htmlFor="licensePlate"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            {t('steps.vehicle.licensePlate')}
          </label>
          <input
            type="text"
            id="licensePlate"
            value={data.licensePlate}
            onChange={(e) =>
              updateField('licensePlate', e.target.value.toUpperCase())
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="mileage"
          className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
        >
          {t('steps.vehicle.mileage')}
        </label>
        <input
          type="text"
          id="mileage"
          value={data.mileage}
          onChange={(e) =>
            updateField('mileage', e.target.value.replace(/\D/g, ''))
          }
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          placeholder="e.g., 45,000"
        />
      </div>
    </div>
  );
}

function StepIncidentDetails({
  data,
  dispatch,
  errors,
  t,
}: {
  data: QuoteFormData;
  dispatch: React.Dispatch<QuoteFormAction>;
  errors: QuoteFormState['errors'];
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const updateField = useCallback(
    (field: keyof QuoteFormData, value: string) => {
      dispatch({ type: 'UPDATE_FIELD', field, value });
    },
    [dispatch],
  );

  return (
    <div
      className="space-y-4"
      role="tabpanel"
      aria-label={t('steps.incident.title')}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {t('steps.incident.title')}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="incidentDate"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            {t('steps.incident.date')}
          </label>
          <input
            type="date"
            id="incidentDate"
            value={data.incidentDate}
            onChange={(e) => updateField('incidentDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            {t('steps.incident.drivable.title')}
          </label>
          <div className="flex gap-3">
            {(['yes', 'no', 'unknown'] as const).map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name="drivable"
                  value={option}
                  checked={data.drivable === option}
                  onChange={(e) => updateField('drivable', e.target.value)}
                  className="mr-2 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t(`steps.incident.drivable.${option}`)}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="incidentLocation"
          className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
        >
          {t('steps.incident.location')}
        </label>
        <input
          type="text"
          id="incidentLocation"
          value={data.incidentLocation}
          onChange={(e) => updateField('incidentLocation', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          placeholder={t('steps.incident.locationPlaceholder')}
        />
      </div>

      <div>
        <label
          htmlFor="incidentDescription"
          className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
        >
          {t('steps.incident.description')} *
        </label>
        <textarea
          id="incidentDescription"
          required
          rows={5}
          value={data.incidentDescription}
          onChange={(e) => updateField('incidentDescription', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-vertical"
          placeholder={t('steps.incident.descriptionPlaceholder')}
          aria-invalid={errors.incidentDescription ? 'true' : 'false'}
          aria-describedby={
            errors.incidentDescription ? 'incidentDescription-error' : undefined
          }
        />
        {errors.incidentDescription && (
          <p
            id="incidentDescription-error"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {errors.incidentDescription}
          </p>
        )}
      </div>
    </div>
  );
}

function StepDamageAssessment({
  data,
  dispatch,
  errors,
  t,
}: {
  data: QuoteFormData;
  dispatch: React.Dispatch<QuoteFormAction>;
  errors: QuoteFormState['errors'];
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const updateField = useCallback(
    (field: keyof QuoteFormData, value: string | string[]) => {
      dispatch({ type: 'UPDATE_FIELD', field, value });
    },
    [dispatch],
  );

  const toggleDamageArea = useCallback(
    (area: string) => {
      const current = data.damageAreas;
      const updated = current.includes(area)
        ? current.filter((a) => a !== area)
        : [...current, area];
      updateField('damageAreas', updated);
    },
    [data.damageAreas, updateField],
  );

  const damageAreas = [
    { id: 'front-bumper', label: t('steps.damage.areas.frontBumper') },
    { id: 'rear-bumper', label: t('steps.damage.areas.rearBumper') },
    { id: 'hood', label: t('steps.damage.areas.hood') },
    { id: 'trunk', label: t('steps.damage.areas.trunk') },
    { id: 'roof', label: t('steps.damage.areas.roof') },
    { id: 'driver-door', label: t('steps.damage.areas.driverDoor') },
    { id: 'passenger-door', label: t('steps.damage.areas.passengerDoor') },
    { id: 'driver-side', label: t('steps.damage.areas.driverSide') },
    { id: 'passenger-side', label: t('steps.damage.areas.passengerSide') },
    { id: 'headlights', label: t('steps.damage.areas.headlights') },
    { id: 'taillights', label: t('steps.damage.areas.taillights') },
    { id: 'windshield', label: t('steps.damage.areas.windshield') },
    { id: 'windows', label: t('steps.damage.areas.windows') },
    { id: 'wheels', label: t('steps.damage.areas.wheels') },
    { id: 'other', label: t('steps.damage.areas.other') },
  ];

  return (
    <div
      className="space-y-4"
      role="tabpanel"
      aria-label={t('steps.damage.title')}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {t('steps.damage.title')}
      </h3>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          {t('steps.damage.areasTitle')} *
        </label>
        <div
          className="grid grid-cols-2 sm:grid-cols-3 gap-2"
          role="group"
          aria-label={t('steps.damage.areasTitle')}
        >
          {damageAreas.map((area) => (
            <label
              key={area.id}
              className="flex items-center p-2 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={data.damageAreas.includes(area.id)}
                onChange={() => toggleDamageArea(area.id)}
                className="mr-2 text-red-600 focus:ring-red-500 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {area.label}
              </span>
            </label>
          ))}
        </div>
        {errors.damageAreas && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.damageAreas}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          {t('steps.damage.hasPhotos')}
        </label>
        <div className="flex gap-3">
          {(['yes', 'no'] as const).map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                name="hasPhotos"
                value={option}
                checked={data.hasPhotos === option}
                onChange={(e) => updateField('hasPhotos', e.target.value)}
                className="mr-2 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {t(`steps.damage.photoOptions.${option}`)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {data.hasPhotos === 'yes' && (
        <div>
          <label
            htmlFor="photoDescription"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            {t('steps.damage.photoDescription')}
          </label>
          <textarea
            id="photoDescription"
            rows={3}
            value={data.photoDescription}
            onChange={(e) => updateField('photoDescription', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-vertical"
            placeholder={t('steps.damage.photoDescriptionPlaceholder')}
          />
        </div>
      )}
    </div>
  );
}

function StepInsuranceInfo({
  data,
  dispatch,
  errors,
  t,
}: {
  data: QuoteFormData;
  dispatch: React.Dispatch<QuoteFormAction>;
  errors: QuoteFormState['errors'];
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const updateField = useCallback(
    (field: keyof QuoteFormData, value: string) => {
      dispatch({ type: 'UPDATE_FIELD', field, value });
    },
    [dispatch],
  );

  const commonInsuranceCompanies = [
    'State Farm',
    'Geico',
    'Progressive',
    'Allstate',
    'Liberty Mutual',
    'Nationwide',
    'Farmers',
    'USAA',
    'Travelers',
    'American Family',
    'Other',
    'Not insured',
  ];

  return (
    <div
      className="space-y-4"
      role="tabpanel"
      aria-label={t('steps.insurance.title')}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {t('steps.insurance.title')}
      </h3>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          {t('steps.insurance.hasClaim')}
        </label>
        <div className="flex flex-wrap gap-3">
          {(['yes', 'no', 'pending'] as const).map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                name="hasClaim"
                value={option}
                checked={data.hasClaim === option}
                onChange={(e) => updateField('hasClaim', e.target.value)}
                className="mr-2 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {t(`steps.insurance.claimOptions.${option}`)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {(data.hasClaim === 'yes' || data.hasClaim === 'pending') && (
        <>
          <div>
            <label
              htmlFor="insuranceCompany"
              className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
            >
              {t('steps.insurance.company')}
            </label>
            <select
              id="insuranceCompany"
              value={data.insuranceCompany}
              onChange={(e) => updateField('insuranceCompany', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="">{t('steps.insurance.selectCompany')}</option>
              {commonInsuranceCompanies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="policyNumber"
                className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
              >
                {t('steps.insurance.policyNumber')}
              </label>
              <input
                type="text"
                id="policyNumber"
                value={data.policyNumber}
                onChange={(e) => updateField('policyNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="claimNumber"
                className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
              >
                {t('steps.insurance.claimNumber')}
              </label>
              <input
                type="text"
                id="claimNumber"
                value={data.claimNumber}
                onChange={(e) => updateField('claimNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder={t('steps.insurance.claimNumberPlaceholder')}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="deductible"
              className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
            >
              {t('steps.insurance.deductible')}
            </label>
            <select
              id="deductible"
              value={data.deductible}
              onChange={(e) => updateField('deductible', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="">{t('steps.insurance.selectDeductible')}</option>
              <option value="0">$0</option>
              <option value="100">$100</option>
              <option value="250">$250</option>
              <option value="500">$500</option>
              <option value="1000">$1,000</option>
              <option value="other">
                {t('steps.insurance.otherDeductible')}
              </option>
            </select>
          </div>
        </>
      )}

      {data.hasClaim === 'no' && (
        <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-4 rounded">
          {t('steps.insurance.noClaimMessage')}
        </p>
      )}
    </div>
  );
}

function StepScheduling({
  data,
  dispatch,
  errors,
  t,
}: {
  data: QuoteFormData;
  dispatch: React.Dispatch<QuoteFormAction>;
  errors: QuoteFormState['errors'];
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const updateField = useCallback(
    (field: keyof QuoteFormData, value: string | boolean) => {
      dispatch({ type: 'UPDATE_FIELD', field, value });
    },
    [dispatch],
  );

  const prefersReducedMotion = usePrefersReducedMotion();

  // Generate next 14 business days (excluding Sundays)
  const generateBusinessDays = useCallback(() => {
    const days: Array<{
      date: Date;
      dateStr: string;
      isSaturday: boolean;
      label: string;
    }> = [];
    const today = new Date();
    const current = new Date(today);

    while (days.length < 14) {
      const dayOfWeek = current.getDay(); // 0 = Sunday, 6 = Saturday

      if (dayOfWeek !== 0) {
        // Skip Sundays
        const dateStr = current.toISOString().split('T')[0];
        const isSaturday = dayOfWeek === 6;

        // Format date for display
        const locale =
          typeof window !== 'undefined'
            ? navigator.language || 'en-US'
            : 'en-US';

        days.push({
          date: new Date(current),
          dateStr,
          isSaturday,
          label: current.toLocaleDateString(locale, {
            month: 'short',
            day: 'numeric',
          }),
        });
      }

      current.setDate(current.getDate() + 1);
    }

    return days;
  }, []);

  const businessDays = generateBusinessDays();

  // Generate time slots based on day type
  const generateTimeSlots = useCallback((dateStr: string) => {
    if (!dateStr) return [];

    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    const isSaturday = dayOfWeek === 6;

    const slots: Array<{ time: string; label: string }> = [];

    if (isSaturday) {
      // Saturday: 8AM - 12PM (4 slots)
      for (let hour = 8; hour < 12; hour++) {
        const time = `${hour.toString().padStart(2, '0')}:00`;
        const label = hour < 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;
        slots.push({ time, label });
      }
    } else {
      // Weekdays: 8AM - 5PM (9 slots)
      for (let hour = 8; hour < 17; hour++) {
        const time = `${hour.toString().padStart(2, '0')}:00`;
        const label =
          hour < 12
            ? `${hour}:00 AM`
            : hour === 12
              ? '12:00 PM'
              : `${hour - 12}:00 PM`;
        slots.push({ time, label });
      }
    }

    return slots;
  }, []);

  const timeSlots = data.appointmentDate
    ? generateTimeSlots(data.appointmentDate)
    : [];

  // Handle date selection
  const handleDateSelect = useCallback(
    (dateStr: string) => {
      updateField('appointmentDate', dateStr);
      updateField('appointmentTime', ''); // Clear time when date changes
    },
    [updateField],
  );

  // Handle keyboard navigation for date chips
  const handleDateKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      const chips = businessDays;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (index > 0) {
            const prevButton = document.querySelector(
              `[data-date-index="${index - 1}"]`,
            ) as HTMLButtonElement;
            prevButton?.focus();
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (index < chips.length - 1) {
            const nextButton = document.querySelector(
              `[data-date-index="${index + 1}"]`,
            ) as HTMLButtonElement;
            nextButton?.focus();
          }
          break;
        case 'Home':
          e.preventDefault();
          const firstButton = document.querySelector(
            '[data-date-index="0"]',
          ) as HTMLButtonElement;
          firstButton?.focus();
          break;
        case 'End':
          e.preventDefault();
          const lastButton = document.querySelector(
            `[data-date-index="${chips.length - 1}"]`,
          ) as HTMLButtonElement;
          lastButton?.focus();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          handleDateSelect(chips[index].dateStr);
          break;
      }
    },
    [businessDays, handleDateSelect],
  );

  // Build review summary for Steps 1-4
  const buildReviewSummary = useCallback(() => {
    const summary = [];

    // Step 1: Contact
    if (data.firstName || data.lastName) {
      summary.push({
        step: 1,
        title: t('steps.review.contactTitle'),
        items: [
          data.firstName &&
            data.lastName &&
            `${data.firstName} ${data.lastName}`,
          data.email,
          data.phone,
          data.preferredContact &&
            t(`steps.contact.methods.${data.preferredContact}`),
        ].filter(Boolean),
      });
    }

    // Step 2: Vehicle
    if (data.vehicleYear || data.vehicleMake) {
      summary.push({
        step: 2,
        title: t('steps.review.vehicleTitle'),
        items: [
          data.vehicleYear && data.vehicleMake && data.vehicleModel
            ? `${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel}`
            : [data.vehicleYear, data.vehicleMake, data.vehicleModel]
                .filter(Boolean)
                .join(' '),
          data.vehicleVin && `VIN: ${data.vehicleVin}`,
          data.licensePlate && `Plate: ${data.licensePlate}`,
        ].filter(Boolean),
      });
    }

    // Step 3: Incident
    if (data.incidentDescription) {
      summary.push({
        step: 3,
        title: t('steps.review.incidentTitle'),
        items: [
          data.incidentDate && new Date(data.incidentDate).toLocaleDateString(),
          data.incidentLocation,
          data.drivable !== 'unknown' &&
            t(`steps.incident.drivable.${data.drivable}`),
          data.incidentDescription?.substring(0, 100) +
            (data.incidentDescription?.length > 100 ? '...' : ''),
        ].filter(Boolean),
      });
    }

    // Step 4: Damage
    if (data.damageAreas.length > 0) {
      summary.push({
        step: 4,
        title: t('steps.review.damageTitle'),
        items: [
          `${data.damageAreas.length} ${t('steps.review.areasSelected')}`,
          data.hasPhotos === 'yes' && t('steps.review.hasPhotos'),
        ].filter(Boolean),
      });
    }

    return summary;
  }, [data, t]);

  const reviewSummary = buildReviewSummary();

  return (
    <div
      className="space-y-6"
      role="tabpanel"
      aria-label={t('steps.scheduling.title')}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {t('steps.scheduling.title')}
      </h3>

      {/* Date Chips - Horizontal Scrollable */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('steps.scheduling.selectDate')}
        </label>
        <div
          role="listbox"
          aria-label={t('steps.scheduling.dateLabel')}
          aria-live="polite"
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          style={{ scrollbarWidth: 'thin' }}
        >
          {businessDays.map((day, index) => (
            <button
              key={day.dateStr}
              data-date-index={index}
              type="button"
              role="option"
              aria-selected={data.appointmentDate === day.dateStr}
              tabIndex={data.appointmentDate === day.dateStr ? 0 : -1}
              onClick={() => handleDateSelect(day.dateStr)}
              onKeyDown={(e) => handleDateKeyDown(e, index)}
              className={`flex-shrink-0 flex flex-col items-center justify-center min-w-[4.5rem] h-16 px-3 py-2 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                data.appointmentDate === day.dateStr
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-red-400'
              }`}
            >
              <span className="text-sm font-semibold">{day.label}</span>
              {day.isSaturday && (
                <span
                  className={`text-xs mt-0.5 ${
                    data.appointmentDate === day.dateStr
                      ? 'text-red-100'
                      : 'text-orange-500 dark:text-orange-400'
                  }`}
                >
                  {t('steps.scheduling.halfDay')}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots Grid */}
      {data.appointmentDate && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('steps.scheduling.selectTime')}
          </label>
          <div
            role="radiogroup"
            aria-label={t('steps.scheduling.timeLabel')}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2"
          >
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                type="button"
                role="radio"
                aria-checked={data.appointmentTime === slot.time}
                onClick={() => updateField('appointmentTime', slot.time)}
                className={`py-2 px-3 rounded-lg border-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  data.appointmentTime === slot.time
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-red-400'
                }`}
              >
                {slot.label}
              </button>
            ))}
          </div>
          {data.appointmentTime && (
            <p
              className="text-sm text-green-600 dark:text-green-400"
              aria-live="polite"
            >
              {t('steps.scheduling.selectedTime', {
                date: new Date(data.appointmentDate).toLocaleDateString(),
                time:
                  timeSlots.find((s) => s.time === data.appointmentTime)
                    ?.label ?? '',
              })}
            </p>
          )}
        </div>
      )}

      {/* Notes Textarea */}
      <div>
        <label
          htmlFor="schedulingNotes"
          className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
        >
          {t('steps.scheduling.notesLabel')}
        </label>
        <textarea
          id="schedulingNotes"
          rows={3}
          value={data.schedulingNotes}
          onChange={(e) => updateField('schedulingNotes', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-vertical"
          placeholder={t('steps.scheduling.notesPlaceholder')}
        />
      </div>

      {/* Review Panel */}
      {reviewSummary.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {t('steps.review.title')}
          </h4>
          {reviewSummary.map((section) => (
            <div
              key={section.step}
              className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-2 last:pb-0"
            >
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {section.title}
              </p>
              <ul className="mt-1 space-y-0.5">
                {section.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-gray-800 dark:text-gray-200"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Step 7: Confirmation Component
// ============================================================================

function StepConfirmation({
  data,
  dispatch,
  prefersReducedMotion,
  onReset,
  t,
}: {
  data: QuoteFormData;
  dispatch: React.Dispatch<QuoteFormAction>;
  prefersReducedMotion: boolean;
  onReset: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const [showCheckmark, setShowCheckmark] = React.useState(false);

  useEffect(() => {
    // Trigger checkmark animation after mount
    const timer = setTimeout(() => setShowCheckmark(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Format time slot label
  const formatTimeSlot = (time: string, dateStr: string) => {
    if (!time || !dateStr) return '';
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    const isSaturday = dayOfWeek === 6;
    const hour = parseInt(time.split(':')[0], 10);

    if (isSaturday) {
      return `${hour}:00 AM`;
    } else {
      if (hour < 12) {
        return `${hour}:00 AM`;
      } else if (hour === 12) {
        return '12:00 PM';
      } else {
        return `${hour - 12}:00 PM`;
      }
    }
  };

  const hasScheduledAppointment = data.appointmentDate && data.appointmentTime;

  return (
    <div
      className="space-y-6 text-center"
      role="tabpanel"
      aria-label={t('steps.confirmation.title')}
    >
      {/* Animated Checkmark */}
      <div className="flex justify-center">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
            showCheckmark
              ? 'bg-green-100 dark:bg-green-800 scale-100'
              : 'bg-gray-100 dark:bg-gray-800 scale-90'
          }`}
          style={
            prefersReducedMotion
              ? {}
              : {
                  transition: 'all 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                }
          }
        >
          <svg
            className={`w-10 h-10 text-green-600 dark:text-green-400 transition-all duration-300 ${
              showCheckmark ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={
              prefersReducedMotion
                ? {}
                : {
                    transitionDelay: showCheckmark ? '200ms' : '0ms',
                  }
            }
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
              className={prefersReducedMotion ? '' : 'animate-drawCheck'}
              style={
                prefersReducedMotion
                  ? {}
                  : {
                      strokeDasharray: 24,
                      strokeDashoffset: showCheckmark ? 0 : 24,
                      transition: 'stroke-dashoffset 400ms ease-out 300ms',
                    }
              }
            />
          </svg>
        </div>
      </div>

      {/* Success Headline */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t('steps.confirmation.title')}
        </h3>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {t('steps.confirmation.message', { firstName: data.firstName })}
        </p>
      </div>

      {/* Appointment Details (if scheduled) */}
      {hasScheduledAppointment && (
        <div
          className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-left"
          aria-label={t('steps.confirmation.appointmentLabel')}
        >
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">
            {t('steps.confirmation.appointmentTitle')}
          </h4>
          <div className="space-y-2 text-sm">
            <p className="text-blue-800 dark:text-blue-300">
              <span className="font-medium">
                {t('steps.confirmation.date')}:
              </span>{' '}
              {new Date(data.appointmentDate).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-blue-800 dark:text-blue-300">
              <span className="font-medium">
                {t('steps.confirmation.time')}:
              </span>{' '}
              {formatTimeSlot(data.appointmentTime, data.appointmentDate)}
            </p>
            {data.schedulingNotes && (
              <p className="text-blue-800 dark:text-blue-300">
                <span className="font-medium">
                  {t('steps.confirmation.notes')}:
                </span>{' '}
                {data.schedulingNotes}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Summary Card */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-left">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
          {t('steps.confirmation.summaryTitle')}
        </h4>
        <div className="space-y-2 text-sm">
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-medium">
              {t('steps.confirmation.vehicle')}:
            </span>{' '}
            {data.vehicleYear} {data.vehicleMake} {data.vehicleModel}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-medium">
              {t('steps.confirmation.contact')}:
            </span>{' '}
            {data.email}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-medium">
              {t('steps.confirmation.damageAreas')}:
            </span>{' '}
            {data.damageAreas.length > 0
              ? t('steps.confirmation.areasCount', {
                  count: data.damageAreas.length,
                })
              : t('steps.confirmation.noAreas')}
          </p>
        </div>
      </div>

      {/* Photo Upload Instructions (if hasPhotos) */}
      {data.hasPhotos === 'yes' && (
        <div
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-left"
          aria-label={t('steps.confirmation.photoInstructionsLabel')}
        >
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div>
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                {t('steps.confirmation.photoTitle')}
              </h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                {t('steps.confirmation.photoInstructions')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p>{t('steps.confirmation.followUp')}</p>
      </div>

      {/* Submit Another Button */}
      <div className="pt-4">
        <Button
          variant="primary"
          size="lg"
          onClick={onReset}
          className="w-full sm:w-auto"
        >
          {t('steps.confirmation.submitAnother')}
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Main QuoteForm Component
// ============================================================================

export function QuoteForm() {
  const [state, dispatch] = useReducer(quoteFormReducer, INITIAL_STATE);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isHydrated = useHydrateFromLocalStorage(dispatch, LOCALSTORAGE_KEY);
  const t = useTranslations('quoteForm');

  // Debounced localStorage persistence (500ms)
  useDebouncedLocalStorage(state, LOCALSTORAGE_KEY, 500);

  const stepContentRef = useRef<HTMLDivElement>(null);

  // Focus first input of new step on navigation
  useEffect(() => {
    if (isHydrated && stepContentRef.current && !prefersReducedMotion) {
      const firstInput = stepContentRef.current.querySelector(
        'input, select, textarea',
      ) as HTMLElement;
      if (firstInput) {
        firstInput.focus();
      }
    }
  }, [state.currentStep, isHydrated, prefersReducedMotion]);

  const handleNext = useCallback(() => {
    const errors = validateStep(state.currentStep, state.data);

    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, error]) => {
        if (error) {
          dispatch({
            type: 'SET_ERROR',
            field: field as keyof QuoteFormData,
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

      // Validate final step
      const errors = validateStep(state.currentStep, state.data);
      if (Object.keys(errors).length > 0) {
        Object.entries(errors).forEach(([field, error]) => {
          if (error) {
            dispatch({
              type: 'SET_ERROR',
              field: field as keyof QuoteFormData,
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

        // Navigate to confirmation step (step 7)
        dispatch({ type: 'GO_TO_STEP', step: 7 });
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

  // Animation classes
  const getAnimationClass = () => {
    if (prefersReducedMotion || !state.direction) return '';
    return state.direction === 'forward'
      ? 'animate-slideInRight'
      : 'animate-slideInLeft';
  };

  const stepComponents = [
    null, // Index 0 (unused)
    StepContactInfo,
    StepVehicleInfo,
    StepIncidentDetails,
    StepDamageAssessment,
    StepInsuranceInfo,
    StepScheduling,
    // StepConfirmation is handled separately
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
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-red-600 h-2.5 rounded-full transition-all duration-300 ease-out"
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
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
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

      {/* Step Content with Animation */}
      <div
        ref={stepContentRef}
        className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 ${getAnimationClass()}`}
        style={prefersReducedMotion ? {} : { animationDuration: '350ms' }}
      >
        {CurrentStepComponent &&
          (state.currentStep === 7 ? (
            <StepConfirmation
              data={state.data}
              dispatch={dispatch}
              prefersReducedMotion={prefersReducedMotion}
              onReset={handleReset}
              t={t}
            />
          ) : (
            <CurrentStepComponent
              data={state.data}
              dispatch={dispatch}
              errors={state.errors}
              t={t}
            />
          ))}

        {/* Navigation Buttons - Only show for steps 1-6 */}
        {state.currentStep < 7 && (
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

            {state.currentStep < TOTAL_STEPS - 1 ? (
              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                className="flex-1"
              >
                {t('buttons.next')}
              </Button>
            ) : (
              <>
                {/* Skip Scheduling Link for Step 6 */}
                {state.currentStep === 6 && (
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({
                        type: 'UPDATE_FIELD',
                        field: 'skipScheduling',
                        value: true,
                      });
                      handleSubmit({
                        preventDefault: () => {},
                      } as React.FormEvent);
                    }}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline transition-colors self-center"
                  >
                    {t('steps.scheduling.skipScheduling')}
                  </button>
                )}
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
              </>
            )}
          </div>
        )}
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

// ============================================================================
// CSS Animations (added via inline styles for now, should be moved to CSS module)
// ============================================================================

// Animation keyframes styles will be injected via a style tag
export function QuoteFormStyles() {
  return (
    <style>{`
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      .animate-slideInRight {
        animation: slideInRight 350ms ease-out forwards;
      }
      
      .animate-slideInLeft {
        animation: slideInLeft 350ms ease-out forwards;
      }
      
      @keyframes drawCheck {
        from {
          stroke-dashoffset: 24;
        }
        to {
          stroke-dashoffset: 0;
        }
      }
      
      .animate-drawCheck {
        animation: drawCheck 400ms ease-out forwards;
      }
      
      @media (prefers-reduced-motion: reduce) {
        .animate-slideInRight,
        .animate-slideInLeft,
        .animate-drawCheck {
          animation: none;
          opacity: 1;
          transform: none;
        }
      }
    `}</style>
  );
}

// Re-export types for external use
export { quoteFormReducer, INITIAL_STATE, INITIAL_DATA, TOTAL_STEPS };

// Default export for dynamic import compatibility
export default QuoteForm;
