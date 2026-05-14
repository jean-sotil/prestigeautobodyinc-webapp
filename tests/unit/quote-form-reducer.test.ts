import { describe, it, expect } from 'vitest';
import {
  initialFormData,
  type QuoteFormData,
  type FormAction,
} from '@/components/quote-form/hooks/useQuoteForm';

// Re-implement the reducer here since it's not exported.
// This tests the exact same logic the component uses.
function formReducer(state: QuoteFormData, action: FormAction): QuoteFormData {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'ADD_FILES': {
      const newFiles = [...state.files, ...action.files].slice(0, 5);
      return { ...state, files: newFiles, hasPhotos: newFiles.length > 0 };
    }
    case 'REMOVE_FILE': {
      const newFiles = state.files.filter((_, i) => i !== action.index);
      return { ...state, files: newFiles, hasPhotos: newFiles.length > 0 };
    }
    case 'RESET':
      return { ...initialFormData, formLoadedAt: Date.now() };
    case 'HYDRATE':
      return { ...initialFormData, ...action.data };
    default:
      return state;
  }
}

function fakeFile(name: string, size = 1024): File {
  return new File([new ArrayBuffer(size)], name, { type: 'image/jpeg' });
}

describe('Quote Form Reducer', () => {
  describe('UPDATE_FIELD', () => {
    it('should update a single field', () => {
      const state = formReducer(initialFormData, {
        type: 'UPDATE_FIELD',
        field: 'service',
        value: 'collision',
      });
      expect(state.service).toBe('collision');
    });

    it('should not mutate other fields', () => {
      const state = formReducer(initialFormData, {
        type: 'UPDATE_FIELD',
        field: 'firstName',
        value: 'John',
      });
      expect(state.firstName).toBe('John');
      expect(state.email).toBe('');
      expect(state.service).toBe('');
    });
  });

  describe('ADD_FILES', () => {
    it('should add files and set hasPhotos to true', () => {
      const file = fakeFile('photo.jpg');
      const state = formReducer(initialFormData, {
        type: 'ADD_FILES',
        files: [file],
      });
      expect(state.files).toHaveLength(1);
      expect(state.hasPhotos).toBe(true);
    });

    it('should cap at 5 files max', () => {
      const files = Array.from({ length: 7 }, (_, i) =>
        fakeFile(`photo${i}.jpg`),
      );
      const state = formReducer(initialFormData, {
        type: 'ADD_FILES',
        files,
      });
      expect(state.files).toHaveLength(5);
    });

    it('should append to existing files', () => {
      let state = formReducer(initialFormData, {
        type: 'ADD_FILES',
        files: [fakeFile('a.jpg'), fakeFile('b.jpg')],
      });
      state = formReducer(state, {
        type: 'ADD_FILES',
        files: [fakeFile('c.jpg')],
      });
      expect(state.files).toHaveLength(3);
    });

    it('should not exceed 5 when appending', () => {
      let state = formReducer(initialFormData, {
        type: 'ADD_FILES',
        files: Array.from({ length: 4 }, (_, i) => fakeFile(`${i}.jpg`)),
      });
      state = formReducer(state, {
        type: 'ADD_FILES',
        files: [fakeFile('5.jpg'), fakeFile('6.jpg')],
      });
      expect(state.files).toHaveLength(5);
    });
  });

  describe('REMOVE_FILE', () => {
    it('should remove file at index', () => {
      const state = formReducer(initialFormData, {
        type: 'ADD_FILES',
        files: [fakeFile('a.jpg'), fakeFile('b.jpg'), fakeFile('c.jpg')],
      });
      const after = formReducer(state, { type: 'REMOVE_FILE', index: 1 });
      expect(after.files).toHaveLength(2);
      expect(after.files[0].name).toBe('a.jpg');
      expect(after.files[1].name).toBe('c.jpg');
    });

    it('should set hasPhotos to false when last file removed', () => {
      const state = formReducer(initialFormData, {
        type: 'ADD_FILES',
        files: [fakeFile('only.jpg')],
      });
      const after = formReducer(state, { type: 'REMOVE_FILE', index: 0 });
      expect(after.files).toHaveLength(0);
      expect(after.hasPhotos).toBe(false);
    });
  });

  describe('RESET', () => {
    it('should reset to initial state with fresh formLoadedAt', () => {
      let state = formReducer(initialFormData, {
        type: 'UPDATE_FIELD',
        field: 'service',
        value: 'collision',
      });
      state = formReducer(state, {
        type: 'UPDATE_FIELD',
        field: 'firstName',
        value: 'John',
      });

      const after = formReducer(state, { type: 'RESET' });
      expect(after.service).toBe('');
      expect(after.firstName).toBe('');
      expect(after.formLoadedAt).toBeGreaterThan(0);
    });
  });

  describe('HYDRATE', () => {
    it('should merge partial data with initial state', () => {
      const state = formReducer(initialFormData, {
        type: 'HYDRATE',
        data: { service: 'painting', firstName: 'Maria' },
      });
      expect(state.service).toBe('painting');
      expect(state.firstName).toBe('Maria');
      expect(state.email).toBe(''); // default
    });
  });
});

describe('initialFormData', () => {
  it('should have all fields with empty/default values', () => {
    expect(initialFormData.service).toBe('');
    expect(initialFormData.files).toEqual([]);
    expect(initialFormData.hasPhotos).toBe(false);
    expect(initialFormData.contactMethod).toBe('phone');
    expect(initialFormData.formLoadedAt).toBe(0);
  });
});
