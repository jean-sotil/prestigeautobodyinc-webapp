import { describe, it, expect } from 'vitest';
import { quoteSchema, type QuoteSchemaInput } from '@/app/api/quote/lib/schema';

function validQuote(overrides: Record<string, unknown> = {}): QuoteSchemaInput {
  return {
    service: 'collision',
    vehicle: { year: 2023, make: 'Toyota', model: 'Camry' },
    damage: {
      severity: 'moderate',
      description: 'Front bumper dent',
      hasPhotos: false,
    },
    contact: {
      firstName: 'John',
      lastName: 'Doe',
      phone: '7146305959',
      email: 'john@example.com',
      preferredMethod: 'phone',
    },
    metadata: {
      locale: 'en',
      source: 'website',
      submittedAt: new Date().toISOString(),
      formLoadedAt: Date.now() - 10000,
      submissionDurationMs: 10000,
      userAgent: 'Mozilla/5.0',
      ipHash: 'abc123',
    },
    ...overrides,
  };
}

function expectFail(data: unknown) {
  const result = quoteSchema.safeParse(data);
  expect(result.success).toBe(false);
  return result;
}

describe('Quote Schema Validation', () => {
  // ── Happy path ──────────────────────────────────────────────────────
  describe('valid submissions', () => {
    it('should accept a complete valid quote', () => {
      expect(quoteSchema.safeParse(validQuote()).success).toBe(true);
    });

    it('should accept minimal required fields', () => {
      const result = quoteSchema.safeParse(
        validQuote({ appointment: null, honeypotTriggered: false }),
      );
      expect(result.success).toBe(true);
    });

    it('should accept all service types', () => {
      for (const service of [
        'collision',
        'bodywork',
        'painting',
        'insurance',
      ]) {
        expect(quoteSchema.safeParse(validQuote({ service })).success).toBe(
          true,
        );
      }
    });

    it('should accept all severity levels', () => {
      for (const severity of ['minor', 'moderate', 'major', 'unsure']) {
        const data = validQuote({ damage: { severity, hasPhotos: false } });
        expect(quoteSchema.safeParse(data).success).toBe(true);
      }
    });

    it('should accept both locales', () => {
      for (const locale of ['en', 'es']) {
        const data = validQuote({
          metadata: { ...validQuote().metadata, locale },
        });
        expect(quoteSchema.safeParse(data).success).toBe(true);
      }
    });

    it('should accept valid VIN', () => {
      const data = validQuote({
        vehicle: { year: 2023, make: 'Toyota', vin: '1HGBH41JXMN109186' },
      });
      expect(quoteSchema.safeParse(data).success).toBe(true);
    });

    it('should accept empty VIN string', () => {
      const data = validQuote({
        vehicle: { year: 2023, make: 'Toyota', vin: '' },
      });
      expect(quoteSchema.safeParse(data).success).toBe(true);
    });

    it('should accept appointment with all fields', () => {
      const data = validQuote({
        appointment: {
          date: '2025-01-15',
          time: '10:00',
          notes: 'Morning preferred',
        },
      });
      expect(quoteSchema.safeParse(data).success).toBe(true);
    });
  });

  // ── Service validation ──────────────────────────────────────────────
  describe('service field', () => {
    it('should reject invalid service type', () => {
      expectFail(validQuote({ service: 'detailing' }));
    });

    it('should reject empty service', () => {
      expectFail(validQuote({ service: '' }));
    });
  });

  // ── Vehicle validation ──────────────────────────────────────────────
  describe('vehicle fields', () => {
    it('should reject year before 1900', () => {
      expectFail(validQuote({ vehicle: { year: 1899, make: 'Ford' } }));
    });

    it('should reject year too far in the future', () => {
      const tooFar = new Date().getFullYear() + 3;
      expectFail(validQuote({ vehicle: { year: tooFar, make: 'Ford' } }));
    });

    it('should accept current year + 2', () => {
      const maxYear = new Date().getFullYear() + 2;
      const data = validQuote({ vehicle: { year: maxYear, make: 'Ford' } });
      expect(quoteSchema.safeParse(data).success).toBe(true);
    });

    it('should reject empty make', () => {
      expectFail(validQuote({ vehicle: { year: 2023, make: '' } }));
    });

    it('should reject make longer than 50 chars', () => {
      expectFail(validQuote({ vehicle: { year: 2023, make: 'A'.repeat(51) } }));
    });

    it('should reject invalid VIN format', () => {
      expectFail(
        validQuote({ vehicle: { year: 2023, make: 'Toyota', vin: 'INVALID' } }),
      );
    });

    it('should reject VIN with forbidden characters (I, O, Q)', () => {
      expectFail(
        validQuote({
          vehicle: { year: 2023, make: 'Toyota', vin: '1HGBH41IXMN109186' },
        }),
      );
    });

    it('should reject float year', () => {
      expectFail(validQuote({ vehicle: { year: 2023.5, make: 'Toyota' } }));
    });
  });

  // ── Contact validation ──────────────────────────────────────────────
  describe('contact fields', () => {
    it('should reject empty firstName', () => {
      expectFail(
        validQuote({
          contact: { ...validQuote().contact, firstName: '' },
        }),
      );
    });

    it('should reject phone with less than 10 digits', () => {
      expectFail(
        validQuote({
          contact: { ...validQuote().contact, phone: '123456789' },
        }),
      );
    });

    it('should reject phone with more than 15 digits', () => {
      expectFail(
        validQuote({
          contact: { ...validQuote().contact, phone: '1234567890123456' },
        }),
      );
    });

    it('should reject phone with non-digit characters', () => {
      expectFail(
        validQuote({
          contact: { ...validQuote().contact, phone: '714-630-5959' },
        }),
      );
    });

    it('should reject invalid email', () => {
      expectFail(
        validQuote({
          contact: { ...validQuote().contact, email: 'not-an-email' },
        }),
      );
    });

    it('should reject invalid preferredMethod', () => {
      expectFail(
        validQuote({
          contact: { ...validQuote().contact, preferredMethod: 'fax' },
        }),
      );
    });

    it('should accept 15-digit international phone', () => {
      const data = validQuote({
        contact: { ...validQuote().contact, phone: '123456789012345' },
      });
      expect(quoteSchema.safeParse(data).success).toBe(true);
    });
  });

  // ── Damage validation ───────────────────────────────────────────────
  describe('damage fields', () => {
    it('should reject invalid severity', () => {
      expectFail(
        validQuote({ damage: { severity: 'catastrophic', hasPhotos: false } }),
      );
    });

    it('should reject description longer than 500 chars', () => {
      expectFail(
        validQuote({
          damage: {
            severity: 'minor',
            description: 'A'.repeat(501),
            hasPhotos: false,
          },
        }),
      );
    });

    it('should require hasPhotos boolean', () => {
      expectFail(validQuote({ damage: { severity: 'minor' } }));
    });
  });

  // ── Metadata validation ─────────────────────────────────────────────
  describe('metadata fields', () => {
    it('should reject invalid locale', () => {
      expectFail(
        validQuote({
          metadata: { ...validQuote().metadata, locale: 'fr' },
        }),
      );
    });

    it('should require submittedAt', () => {
      const meta = { ...validQuote().metadata };
      delete (meta as Record<string, unknown>).submittedAt;
      expectFail(validQuote({ metadata: meta }));
    });

    it('should require ipHash', () => {
      const meta = { ...validQuote().metadata };
      delete (meta as Record<string, unknown>).ipHash;
      expectFail(validQuote({ metadata: meta }));
    });
  });

  // ── Defaults ────────────────────────────────────────────────────────
  describe('defaults', () => {
    it('should default honeypotTriggered to false', () => {
      const data = validQuote();
      delete (data as Record<string, unknown>).honeypotTriggered;
      const result = quoteSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.honeypotTriggered).toBe(false);
      }
    });

    it('should default preferredMethod to phone', () => {
      const contact = { ...validQuote().contact };
      delete (contact as Record<string, unknown>).preferredMethod;
      const result = quoteSchema.safeParse(validQuote({ contact }));
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.contact.preferredMethod).toBe('phone');
      }
    });
  });
});
