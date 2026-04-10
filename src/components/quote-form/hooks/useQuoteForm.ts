'use client';

import { useReducer, useEffect, useRef, useCallback } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface QuoteFormData {
  service: 'collision' | 'bodywork' | 'painting' | 'insurance' | '';
  year: string;
  make: string;
  model: string;
  damage: 'minor' | 'moderate' | 'major' | 'unsure' | '';
  description: string;
  hasPhotos: boolean;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  contactMethod: 'phone' | 'text' | 'email';
}

export type FormAction =
  | {
      type: 'UPDATE_FIELD';
      field: keyof QuoteFormData;
      value: QuoteFormData[keyof QuoteFormData];
    }
  | { type: 'RESET' }
  | { type: 'HYDRATE'; data: Partial<QuoteFormData> };

// ============================================================================
// Initial State
// ============================================================================

export const initialFormData: QuoteFormData = {
  service: '',
  year: '',
  make: '',
  model: '',
  damage: '',
  description: '',
  hasPhotos: false,
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  contactMethod: 'phone',
};

const STORAGE_KEY = 'prestige-quote-draft';

// ============================================================================
// Reducer
// ============================================================================

function formReducer(state: QuoteFormData, action: FormAction): QuoteFormData {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return { ...initialFormData };
    case 'HYDRATE':
      return { ...initialFormData, ...action.data };
    default:
      return state;
  }
}

// ============================================================================
// Hook
// ============================================================================

export function useQuoteForm() {
  const [state, dispatch] = useReducer(formReducer, initialFormData);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydratedRef = useRef(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          dispatch({ type: 'HYDRATE', data: parsed });
        }
      }
    } catch {
      // Corrupted JSON — silently ignore
    }
  }, []);

  // Debounced save to localStorage on state change
  useEffect(() => {
    if (!hydratedRef.current) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Storage full or unavailable — silently ignore
      }
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [state]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Silently ignore
    }
  }, []);

  return { state, dispatch, clearDraft };
}
