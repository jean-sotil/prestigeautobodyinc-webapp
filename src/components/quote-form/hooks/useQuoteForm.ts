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
  files: File[]; // ← NEW: held in useReducer, not localStorage
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  contactMethod: 'phone' | 'text' | 'email';
  date: string | null; // Appointment date
  time: string | null; // Appointment time
  notes: string; // Additional notes
  formLoadedAt: number; // Timestamp for time-based spam check
}

export type FormAction =
  | {
      type: 'UPDATE_FIELD';
      field: keyof QuoteFormData;
      value: QuoteFormData[keyof QuoteFormData];
    }
  | { type: 'ADD_FILES'; files: File[] }
  | { type: 'REMOVE_FILE'; index: number }
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
  files: [], // ← NEW: File[] for damage photos
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  contactMethod: 'phone',
  date: null,
  time: null,
  notes: '',
  formLoadedAt: 0,
};

const STORAGE_KEY = 'prestige-quote-draft';

// ============================================================================
// Reducer
// ============================================================================

function formReducer(state: QuoteFormData, action: FormAction): QuoteFormData {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'ADD_FILES': {
      const newFiles = [...state.files, ...action.files].slice(0, 5); // Max 5 files
      return {
        ...state,
        files: newFiles,
        hasPhotos: newFiles.length > 0,
      };
    }
    case 'REMOVE_FILE': {
      const newFiles = state.files.filter((_, i) => i !== action.index);
      return {
        ...state,
        files: newFiles,
        hasPhotos: newFiles.length > 0,
      };
    }
    case 'RESET':
      return { ...initialFormData, formLoadedAt: Date.now() };
    case 'HYDRATE':
      return { ...initialFormData, ...action.data };
    default:
      return state;
  }
}

// ============================================================================
// Helper: Serialize form data for localStorage (excluding files)
// ============================================================================

function serializeForStorage(data: QuoteFormData): string {
  // Only persist non-file fields and file metadata (names only)
  const storageData = {
    ...data,
    files: data.files.map((f) => ({
      name: f.name,
      type: f.type,
      size: f.size,
    })), // Store metadata only
    _hasFiles: data.files.length > 0,
  };
  return JSON.stringify(storageData);
}

// ============================================================================
// Hook
// ============================================================================

export function useQuoteForm() {
  const [state, dispatch] = useReducer(formReducer, initialFormData);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydratedRef = useRef(false);

  // Set formLoadedAt on initial mount
  useEffect(() => {
    if (hydratedRef.current) return;

    dispatch({
      type: 'UPDATE_FIELD',
      field: 'formLoadedAt',
      value: Date.now(),
    });
  }, []);

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          // Remove files from hydration (can't persist File objects)
          // and set hasPhotos based on _hasFiles flag
          const { files, _hasFiles, ...rest } = parsed;
          dispatch({
            type: 'HYDRATE',
            data: {
              ...rest,
              files: [], // Reset files on hydration
              hasPhotos: _hasFiles || false,
            },
          });
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
        localStorage.setItem(STORAGE_KEY, serializeForStorage(state));
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

  // Add files to form
  const addFiles = useCallback((files: File[]) => {
    // Filter allowed types
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/heic',
      'image/heif',
    ];

    const validFiles = files.filter((file) => {
      const isAllowedType = allowedTypes.includes(file.type);
      const isAllowedSize = file.size <= 5 * 1024 * 1024; // 5 MB
      return isAllowedType && isAllowedSize;
    });

    if (validFiles.length > 0) {
      dispatch({ type: 'ADD_FILES', files: validFiles });
    }

    return validFiles.length;
  }, []);

  // Remove file at index
  const removeFile = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_FILE', index });
  }, []);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Silently ignore
    }
  }, []);

  return {
    state,
    dispatch,
    addFiles,
    removeFile,
    clearDraft,
  };
}
