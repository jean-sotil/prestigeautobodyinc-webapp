import { z } from 'zod';
import { createHash } from 'crypto';

// ============================================================================
// Types
// ============================================================================

export interface ParsedFormData {
  fields: Record<string, string>;
  files: Array<{
    filename: string;
    buffer: Buffer;
    mimetype: string;
    size: number;
  }>;
}

export interface QuoteRequest {
  referenceId: string;
  service: 'collision' | 'bodywork' | 'painting' | 'insurance';
  vehicle: {
    year: number;
    make: string;
    model?: string;
    vin?: string;
  };
  damage: {
    severity: 'minor' | 'moderate' | 'major' | 'unsure';
    description?: string;
    hasPhotos: boolean;
    damagePhotos?: string[];
  };
  contact: {
    firstName: string;
    lastName?: string;
    phone: string;
    email: string;
    preferredMethod: 'phone' | 'text' | 'email';
  };
  appointment?: {
    date?: string;
    time?: string;
    notes?: string;
  } | null;
  metadata: {
    locale: 'en' | 'es';
    source: string;
    submittedAt: string;
    formLoadedAt: number;
    submissionDurationMs: number;
    userAgent: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    ipHash: string;
  };
  honeypotTriggered: boolean;
  status: 'new' | 'contacted' | 'estimated' | 'closed';
}

// ============================================================================
// Configuration
// ============================================================================

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20 MB
export const MAX_FILES = 5;
export const MIN_SUBMISSION_TIME = 3000; // 3 seconds
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
];

// ============================================================================
// Zod Schema Validation
// ============================================================================

export const quoteSchema = z.object({
  service: z.enum(['collision', 'bodywork', 'painting', 'insurance']),
  vehicle: z.object({
    year: z
      .number()
      .int()
      .min(1900)
      .max(new Date().getFullYear() + 2),
    make: z.string().min(1).max(50),
    model: z.string().max(50).optional(),
    vin: z
      .string()
      .regex(/^[A-HJ-NPR-Z0-9]{17}$/i, 'Invalid VIN format')
      .optional()
      .or(z.literal('')),
  }),
  damage: z.object({
    severity: z.enum(['minor', 'moderate', 'major', 'unsure']),
    description: z.string().max(500).optional(),
    hasPhotos: z.boolean(),
  }),
  contact: z.object({
    firstName: z.string().min(1).max(50),
    lastName: z.string().max(50).optional(),
    phone: z.string().regex(/^\d{10,15}$/),
    email: z.string().email(),
    preferredMethod: z.enum(['phone', 'text', 'email']).default('phone'),
  }),
  appointment: z
    .object({
      date: z.string().optional(),
      time: z.string().optional(),
      notes: z.string().max(1000).optional(),
    })
    .optional()
    .nullable(),
  metadata: z.object({
    locale: z.enum(['en', 'es']).default('en'),
    source: z.string().default('website'),
    submittedAt: z.string(),
    formLoadedAt: z.number(),
    submissionDurationMs: z.number(),
    userAgent: z.string(),
    utmSource: z.string().optional(),
    utmMedium: z.string().optional(),
    utmCampaign: z.string().optional(),
    ipHash: z.string(),
  }),
  honeypotTriggered: z.boolean().default(false),
});

export type QuoteSchemaInput = z.input<typeof quoteSchema>;

// ============================================================================
// Helper Functions
// ============================================================================

export function generateReferenceId(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PAB-${dateStr}-${random}`;
}

export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT || 'default-salt-change-in-production';
  return createHash('sha256')
    .update(ip + salt)
    .digest('hex');
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .trim();
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, ''); // Remove all non-digit characters
}

export function formatPhoneDisplay(p: string): string {
  if (p.length === 10) {
    return `(${p.slice(0, 3)}) ${p.slice(3, 6)}-${p.slice(6)}`;
  }
  if (p.length === 11 && p.startsWith('1')) {
    return `+1 (${p.slice(1, 4)}) ${p.slice(4, 7)}-${p.slice(7)}`;
  }
  return p;
}
