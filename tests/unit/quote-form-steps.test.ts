import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// These mirror the stepSchemas from QuoteForm.tsx exactly.
// Testing them ensures the client-side validation matches expectations.

const stepSchemas = {
  0: z.object({
    service: z.enum(['collision', 'bodywork', 'painting', 'insurance'], {
      message: 'Please select a service',
    }),
  }),
  1: z.object({
    year: z.string().min(1, "Please select your vehicle's year"),
    make: z.string().min(1, "Please select your vehicle's make"),
  }),
  2: z.object({
    damage: z.enum(['minor', 'moderate', 'major', 'unsure'], {
      message: 'Please select a damage level',
    }),
  }),
  3: z.object({
    firstName: z.string().min(1, 'First name is required').max(50),
    phone: z.string().regex(/^\d{10,}$/, 'Please enter a valid phone number'),
    email: z.string().email('Please enter a valid email address'),
  }),
};

describe('Step 0 — Service Selection', () => {
  const schema = stepSchemas[0];

  it('should accept valid service types', () => {
    for (const service of ['collision', 'bodywork', 'painting', 'insurance']) {
      expect(schema.safeParse({ service }).success).toBe(true);
    }
  });

  it('should reject empty service', () => {
    expect(schema.safeParse({ service: '' }).success).toBe(false);
  });

  it('should reject invalid service', () => {
    expect(schema.safeParse({ service: 'detailing' }).success).toBe(false);
  });
});

describe('Step 1 — Vehicle Info', () => {
  const schema = stepSchemas[1];

  it('should accept year and make', () => {
    expect(schema.safeParse({ year: '2023', make: 'Toyota' }).success).toBe(
      true,
    );
  });

  it('should reject empty year', () => {
    const result = schema.safeParse({ year: '', make: 'Toyota' });
    expect(result.success).toBe(false);
  });

  it('should reject empty make', () => {
    const result = schema.safeParse({ year: '2023', make: '' });
    expect(result.success).toBe(false);
  });

  it('should accept any non-empty make (custom makes allowed)', () => {
    expect(schema.safeParse({ year: '2020', make: 'Rivian' }).success).toBe(
      true,
    );
  });
});

describe('Step 2 — Damage Assessment', () => {
  const schema = stepSchemas[2];

  it('should accept all severity levels', () => {
    for (const damage of ['minor', 'moderate', 'major', 'unsure']) {
      expect(schema.safeParse({ damage }).success).toBe(true);
    }
  });

  it('should reject empty damage', () => {
    expect(schema.safeParse({ damage: '' }).success).toBe(false);
  });

  it('should reject invalid severity', () => {
    expect(schema.safeParse({ damage: 'totaled' }).success).toBe(false);
  });
});

describe('Step 3 — Contact Info', () => {
  const schema = stepSchemas[3];

  const validContact = {
    firstName: 'John',
    phone: '7146305959',
    email: 'john@example.com',
  };

  it('should accept valid contact info', () => {
    expect(schema.safeParse(validContact).success).toBe(true);
  });

  it('should reject empty firstName', () => {
    expect(schema.safeParse({ ...validContact, firstName: '' }).success).toBe(
      false,
    );
  });

  it('should reject firstName over 50 chars', () => {
    expect(
      schema.safeParse({ ...validContact, firstName: 'A'.repeat(51) }).success,
    ).toBe(false);
  });

  it('should reject phone with less than 10 digits', () => {
    expect(
      schema.safeParse({ ...validContact, phone: '123456789' }).success,
    ).toBe(false);
  });

  it('should accept phone with 10+ digits', () => {
    expect(
      schema.safeParse({ ...validContact, phone: '17146305959' }).success,
    ).toBe(true);
  });

  it('should reject phone with non-digit characters', () => {
    expect(
      schema.safeParse({ ...validContact, phone: '714-630-5959' }).success,
    ).toBe(false);
  });

  it('should reject invalid email', () => {
    expect(
      schema.safeParse({ ...validContact, email: 'not-email' }).success,
    ).toBe(false);
  });

  it('should reject missing email', () => {
    expect(
      schema.safeParse({ firstName: 'John', phone: '7146305959' }).success,
    ).toBe(false);
  });

  it('should provide custom error messages', () => {
    const result = schema.safeParse({
      firstName: '',
      phone: '123',
      email: 'bad',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('First name is required');
      expect(messages).toContain('Please enter a valid phone number');
      expect(messages).toContain('Please enter a valid email address');
    }
  });
});
