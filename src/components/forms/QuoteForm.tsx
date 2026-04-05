'use client';

import React, {
  useReducer,
  useEffect,
  useRef,
  useCallback,
  useState,
} from 'react';
import { useTranslations } from 'next-intl';

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

  // Step 6: Scheduling
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
      value: string | string[];
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

const TOTAL_STEPS = 6;

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
  6: ['preferredDate'],
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
    (field: keyof QuoteFormData, value: string) => {
      dispatch({ type: 'UPDATE_FIELD', field, value });
    },
    [dispatch],
  );

  const today = new Date().toISOString().split('T')[0];

  return (
    <div
      className="space-y-4"
      role="tabpanel"
      aria-label={t('steps.scheduling.title')}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {t('steps.scheduling.title')}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="preferredDate"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            {t('steps.scheduling.preferredDate')} *
          </label>
          <input
            type="date"
            id="preferredDate"
            required
            min={today}
            value={data.preferredDate}
            onChange={(e) => updateField('preferredDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            aria-invalid={errors.preferredDate ? 'true' : 'false'}
            aria-describedby={
              errors.preferredDate ? 'preferredDate-error' : undefined
            }
          />
          {errors.preferredDate && (
            <p
              id="preferredDate-error"
              className="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              {errors.preferredDate}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="preferredTime"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            {t('steps.scheduling.preferredTime')}
          </label>
          <select
            id="preferredTime"
            value={data.preferredTime}
            onChange={(e) => updateField('preferredTime', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          >
            <option value="morning">
              {t('steps.scheduling.times.morning')}
            </option>
            <option value="afternoon">
              {t('steps.scheduling.times.afternoon')}
            </option>
            <option value="evening">
              {t('steps.scheduling.times.evening')}
            </option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="alternateDate"
          className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
        >
          {t('steps.scheduling.alternateDate')}
        </label>
        <input
          type="date"
          id="alternateDate"
          min={today}
          value={data.alternateDate}
          onChange={(e) => updateField('alternateDate', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          {t('steps.scheduling.needsRental')}
        </label>
        <div className="flex gap-3">
          {(['yes', 'no'] as const).map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                name="needsRental"
                value={option}
                checked={data.needsRental === option}
                onChange={(e) => updateField('needsRental', e.target.value)}
                className="mr-2 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {t(`steps.scheduling.rentalOptions.${option}`)}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="additionalNotes"
          className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
        >
          {t('steps.scheduling.additionalNotes')}
        </label>
        <textarea
          id="additionalNotes"
          rows={4}
          value={data.additionalNotes}
          onChange={(e) => updateField('additionalNotes', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-vertical"
          placeholder={t('steps.scheduling.notesPlaceholder')}
        />
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

  // Animation classes
  const getAnimationClass = () => {
    if (prefersReducedMotion || !state.direction) return '';
    return state.direction === 'forward'
      ? 'animate-slideInRight'
      : 'animate-slideInLeft';
  };

  // Success state
  if (state.isSubmitted) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-green-50 dark:bg-green-900/20 rounded-xl text-center shadow-md">
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
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {t('success.requestAnother')}
        </button>
      </div>
    );
  }

  const stepComponents = [
    null, // Index 0 (unused)
    StepContactInfo,
    StepVehicleInfo,
    StepIncidentDetails,
    StepDamageAssessment,
    StepInsuranceInfo,
    StepScheduling,
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
            <button
              type="button"
              onClick={handlePrev}
              className="flex-1 py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 font-medium focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              {t('buttons.back')}
            </button>
          )}

          {state.currentStep < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              {t('buttons.next')}
            </button>
          ) : (
            <button
              type="submit"
              disabled={state.isSubmitting}
              className="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              {state.isSubmitting
                ? t('buttons.submitting')
                : t('buttons.submit')}
            </button>
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
      
      @media (prefers-reduced-motion: reduce) {
        .animate-slideInRight,
        .animate-slideInLeft {
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
