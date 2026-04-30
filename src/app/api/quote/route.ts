import { NextResponse } from 'next/server';
import { z } from 'zod';
import Busboy from 'busboy';
import { fileTypeFromBuffer } from 'file-type';
import { createHash } from 'crypto';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { Resend } from 'resend';
import type { Payload } from 'payload';

// ============================================================================
// Types
// ============================================================================

interface ParsedFormData {
  fields: Record<string, string>;
  files: Array<{
    filename: string;
    buffer: Buffer;
    mimetype: string;
    size: number;
  }>;
}

interface QuoteRequest {
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20 MB
const MAX_FILES = 5;
const MIN_SUBMISSION_TIME = 3000; // 3 seconds
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
];

// ============================================================================
// Zod Schema Validation
// ============================================================================

const quoteSchema = z.object({
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

// ============================================================================
// Rate Limiting
// ============================================================================

let ratelimit: Ratelimit | null = null;

function getRatelimit() {
  if (!ratelimit) {
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (redisUrl && redisToken) {
      const redis = new Redis({
        url: redisUrl,
        token: redisToken,
      });

      ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '1 h'), // 3 submissions per hour
        analytics: true,
      });
    }
  }
  return ratelimit;
}

// ============================================================================
// Email Configuration
// ============================================================================

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// ============================================================================
// Helper Functions
// ============================================================================

function generateReferenceId(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PAB-${dateStr}-${random}`;
}

function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT || 'default-salt-change-in-production';
  return createHash('sha256')
    .update(ip + salt)
    .digest('hex');
}

function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .trim();
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, ''); // Remove all non-digit characters
}

async function parseMultipartFormData(
  request: Request,
): Promise<ParsedFormData> {
  const contentType = request.headers.get('content-type') || '';

  if (!contentType.includes('multipart/form-data')) {
    throw new Error('Invalid content type for multipart parsing');
  }

  const chunks: Buffer[] = [];
  const reader = request.body?.getReader();

  if (!reader) {
    throw new Error('No request body available');
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(Buffer.from(value));
  }

  const buffer = Buffer.concat(chunks);

  // File bomb guard
  if (buffer.length > MAX_TOTAL_SIZE + 2 * 1024 * 1024) {
    // Allow some buffer for headers
    throw new Error('Payload too large');
  }

  return new Promise((resolve, reject) => {
    const fields: Record<string, string> = {};
    const files: ParsedFormData['files'] = [];
    let totalSize = 0;

    const busboy = Busboy({
      headers: {
        'content-type': contentType,
      },
      limits: {
        fileSize: MAX_FILE_SIZE,
        files: MAX_FILES,
        fieldSize: 1024 * 1024, // 1 MB for fields
      },
    });

    busboy.on('field', (name, value) => {
      fields[name] = value;
    });

    busboy.on('file', (name, stream, info) => {
      const chunks: Buffer[] = [];

      stream.on('data', (data: Buffer) => {
        chunks.push(data);
        totalSize += data.length;

        if (totalSize > MAX_TOTAL_SIZE) {
          stream.destroy();
          reject(new Error('Total file size exceeds limit'));
        }
      });

      stream.on('end', () => {
        if (files.length < MAX_FILES) {
          files.push({
            filename: info.filename,
            buffer: Buffer.concat(chunks),
            mimetype: info.mimeType,
            size: Buffer.concat(chunks).length,
          });
        }
      });

      stream.on('error', reject);
    });

    busboy.on('finish', () => {
      resolve({ fields, files });
    });

    busboy.on('error', reject);

    busboy.end(buffer);
  });
}

async function validateFiles(
  files: ParsedFormData['files'],
): Promise<{ valid: ParsedFormData['files']; errors: string[] }> {
  const valid: ParsedFormData['files'] = [];
  const errors: string[] = [];

  for (const file of files) {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`File "${file.filename}" exceeds 5 MB limit`);
      continue;
    }

    // Validate MIME type using magic bytes
    const fileType = await fileTypeFromBuffer(file.buffer);

    if (!fileType || !ALLOWED_MIME_TYPES.includes(fileType.mime)) {
      errors.push(`File "${file.filename}" is not a valid image type`);
      continue;
    }

    valid.push({
      ...file,
      mimetype: fileType.mime, // Use the validated MIME type
    });
  }

  return { valid, errors };
}

// ============================================================================
// Payload CMS Integration
// ============================================================================

async function uploadMediaToPayload(
  payload: Payload,
  file: { filename: string; buffer: Buffer; mimetype: string; size: number },
  referenceId: string,
): Promise<string | null> {
  try {
    const media = await payload.create({
      collection: 'media',
      data: {
        alt: {
          en: `Damage photo - ${referenceId}`,
          es: `Foto de daño - ${referenceId}`,
        },
      },
      file: {
        data: file.buffer,
        mimetype: file.mimetype,
        name: file.filename,
        size: file.size,
      },
    });

    return String(media.id);
  } catch (error) {
    console.error('Failed to upload media:', error);
    return null;
  }
}

async function createQuoteRequest(
  payload: Payload,
  data: QuoteRequest,
): Promise<unknown> {
  try {
    return await payload.create({
      collection: 'quote-requests',
      data: {
        referenceId: data.referenceId,
        service: data.service,
        vehicle: data.vehicle,
        damage: data.damage,
        contact: data.contact,
        ...(data.appointment ? { appointment: data.appointment } : {}),
        metadata: data.metadata,
        honeypotTriggered: data.honeypotTriggered,
        status: data.status,
      },
    });
  } catch (error) {
    console.error('Failed to create quote request:', error);
    throw error;
  }
}

async function getPayload() {
  // Dynamic import to avoid issues with Edge runtime
  const { getPayload } = await import('payload');
  const config = await import('@/payload/payload.config');
  return getPayload({ config: config.default });
}

// ============================================================================
// Email Functions
// ============================================================================

const BRAND = {
  bg: '#F4F4F5',
  surface: '#FFFFFF',
  surfaceMuted: '#FAFAF9',
  border: '#E4E4E7',
  textPrimary: '#18181B',
  textSecondary: '#52525B',
  textMuted: '#71717A',
  headerBg: '#0F172A',
  headerText: '#F8FAFC',
  headerMuted: '#94A3B8',
  accent: '#D97706',
} as const;

const SEVERITY_STYLE: Record<
  string,
  { bg: string; text: string; border: string; en: string; es: string }
> = {
  minor: {
    bg: '#DCFCE7',
    text: '#166534',
    border: '#86EFAC',
    en: 'Minor',
    es: 'Menor',
  },
  moderate: {
    bg: '#FEF3C7',
    text: '#92400E',
    border: '#FCD34D',
    en: 'Moderate',
    es: 'Moderado',
  },
  major: {
    bg: '#FEE2E2',
    text: '#991B1B',
    border: '#FCA5A5',
    en: 'Major',
    es: 'Mayor',
  },
  unsure: {
    bg: '#F4F4F5',
    text: '#52525B',
    border: '#D4D4D8',
    en: 'Unsure',
    es: 'No estoy seguro',
  },
};

const SERVICE_LABELS: Record<string, { en: string; es: string }> = {
  collision: { en: 'Collision Repair', es: 'Reparación por Colisión' },
  bodywork: { en: 'Bodywork', es: 'Carrocería' },
  painting: { en: 'Painting', es: 'Pintura' },
  insurance: { en: 'Insurance Claim', es: 'Reclamo de Seguro' },
};

const PREFERRED_METHOD_LABELS: Record<string, { en: string; es: string }> = {
  phone: { en: 'phone call', es: 'llamada telefónica' },
  text: { en: 'text message', es: 'mensaje de texto' },
  email: { en: 'email', es: 'correo electrónico' },
};

function formatPhoneDisplay(p: string): string {
  if (p.length === 10) {
    return `(${p.slice(0, 3)}) ${p.slice(3, 6)}-${p.slice(6)}`;
  }
  if (p.length === 11 && p.startsWith('1')) {
    return `+1 (${p.slice(1, 4)}) ${p.slice(4, 7)}-${p.slice(7)}`;
  }
  return p;
}

function emailShell(args: {
  preheader: string;
  locale: 'en' | 'es';
  bodyHtml: string;
}): string {
  const { preheader, locale, bodyHtml } = args;
  const isSpanish = locale === 'es';
  const footerNote = isSpanish
    ? 'Este correo fue enviado porque solicitó una cotización en nuestro sitio web.'
    : 'This email was sent because you requested a quote on our website.';

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="${locale}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="x-apple-disable-message-reformatting" />
<title>Prestige Auto Body Inc.</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
  body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; display: block; }
  table { border-collapse: collapse !important; }
  body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
  a { color: ${BRAND.accent}; text-decoration: none; }
  @media screen and (max-width: 600px) {
    .container { width: 100% !important; }
    .px-card { padding-left: 20px !important; padding-right: 20px !important; }
    .photo-cell { display: block !important; width: 100% !important; padding: 0 0 12px 0 !important; }
    .h1 { font-size: 24px !important; line-height: 1.25 !important; }
    .ref-value { font-size: 22px !important; letter-spacing: 1px !important; }
    .pill-row td { display: inline-block !important; padding-bottom: 6px !important; }
    .action-btn { display: block !important; width: auto !important; }
  }
  @media (prefers-color-scheme: dark) {
    .dm-bg { background-color: #09090B !important; }
    .dm-surface { background-color: #18181B !important; }
    .dm-surface-muted { background-color: #27272A !important; }
    .dm-border { border-color: #27272A !important; }
    .dm-text-primary { color: #FAFAFA !important; }
    .dm-text-secondary { color: #A1A1AA !important; }
  }
</style>
</head>
<body class="dm-bg" style="margin: 0; padding: 0; background-color: ${BRAND.bg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: ${BRAND.textPrimary};">
<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all; font-size: 1px; line-height: 1px; color: ${BRAND.bg};">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="dm-bg" style="background-color: ${BRAND.bg};">
  <tr>
    <td align="center" style="padding: 32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="container" style="width: 600px; max-width: 600px;">
        <tr>
          <td class="px-card" style="background-color: ${BRAND.headerBg}; border-radius: 12px 12px 0 0; padding: 28px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="color: ${BRAND.headerText}; font-size: 17px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Prestige Auto&nbsp;Body</td>
                <td align="right" style="color: ${BRAND.headerMuted}; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Anaheim&nbsp;·&nbsp;CA</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td style="background-color: ${BRAND.accent}; height: 4px; line-height: 4px; font-size: 4px;">&nbsp;</td></tr>
        ${bodyHtml}
        <tr>
          <td class="dm-surface px-card" style="background-color: ${BRAND.surface}; border-radius: 0 0 12px 12px; border-top: 1px solid ${BRAND.border}; padding: 28px 32px;">
            <p class="dm-text-primary" style="margin: 0 0 6px; color: ${BRAND.textPrimary}; font-size: 14px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Prestige Auto Body Inc.</p>
            <p class="dm-text-secondary" style="margin: 0; color: ${BRAND.textSecondary}; font-size: 13px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
              1161 N Tustin Ave, Anaheim, CA 92807<br />
              <a href="tel:+17146305959" style="color: ${BRAND.textSecondary}; text-decoration: none;">(714) 630-5959</a>
            </p>
            <p class="dm-text-secondary" style="margin: 16px 0 0; color: ${BRAND.textMuted}; font-size: 11px; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${footerNote}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

function dataRow(label: string, value: string, isFirst = false): string {
  const topBorder = isFirst ? '' : `border-top: 1px solid ${BRAND.border};`;
  const borderClass = isFirst ? '' : 'dm-border';
  return `<tr><td class="${borderClass}" style="padding: 14px 0; ${topBorder}">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td class="dm-text-secondary" style="color: ${BRAND.textMuted}; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; width: 38%; vertical-align: top; padding-right: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${label}</td>
        <td class="dm-text-primary" style="color: ${BRAND.textPrimary}; font-size: 15px; font-weight: 500; line-height: 1.5; vertical-align: top; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${value}</td>
      </tr>
    </table>
  </td></tr>`;
}

function sectionCard(title: string, innerHtml: string): string {
  return `<tr><td class="dm-surface px-card" style="background-color: ${BRAND.surface}; padding: 8px 32px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td class="dm-border" style="padding: 24px 0 12px; border-top: 1px solid ${BRAND.border};">
        <p class="dm-text-primary" style="margin: 0; color: ${BRAND.textPrimary}; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${title}</p>
      </td></tr>
      <tr><td style="padding-bottom: 8px;">${innerHtml}</td></tr>
    </table>
  </td></tr>`;
}

function photoGrid(photoUrls: string[], altPrefix: string): string {
  if (photoUrls.length === 0) return '';
  const rows: string[] = [];
  for (let i = 0; i < photoUrls.length; i += 2) {
    const left = photoUrls[i];
    const right = photoUrls[i + 1];
    rows.push(`<tr>
      <td valign="top" class="photo-cell" style="width: 50%; padding: 0 6px 12px 0;">
        <img src="${left}" alt="${altPrefix} ${i + 1}" width="270" style="width: 100%; max-width: 270px; height: auto; border-radius: 8px; border: 1px solid ${BRAND.border};" />
      </td>
      <td valign="top" class="photo-cell" style="width: 50%; padding: 0 0 12px 6px;">
        ${
          right
            ? `<img src="${right}" alt="${altPrefix} ${i + 2}" width="270" style="width: 100%; max-width: 270px; height: auto; border-radius: 8px; border: 1px solid ${BRAND.border};" />`
            : '&nbsp;'
        }
      </td>
    </tr>`);
  }
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows.join('')}</table>`;
}

function generateCustomerEmailHtml(
  quote: QuoteRequest,
  photoUrls: string[],
): string {
  const isSpanish = quote.metadata.locale === 'es';
  const serviceLabel =
    SERVICE_LABELS[quote.service]?.[isSpanish ? 'es' : 'en'] ?? quote.service;
  const vehicleStr = `${quote.vehicle.year} ${quote.vehicle.make}${quote.vehicle.model ? ` ${quote.vehicle.model}` : ''}`;
  const sev = SEVERITY_STYLE[quote.damage.severity] ?? SEVERITY_STYLE.unsure;
  const severityLabel = isSpanish ? sev.es : sev.en;
  const preferred =
    PREFERRED_METHOD_LABELS[quote.contact.preferredMethod]?.[
      isSpanish ? 'es' : 'en'
    ] ?? quote.contact.preferredMethod;

  const heroSection = `<tr>
    <td class="dm-surface px-card" style="background-color: ${BRAND.surface}; padding: 40px 32px 8px;">
      <p style="margin: 0 0 10px; color: ${BRAND.accent}; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${isSpanish ? 'Solicitud Recibida' : 'Request Received'}</p>
      <h1 class="h1 dm-text-primary" style="margin: 0 0 14px; color: ${BRAND.textPrimary}; font-size: 28px; font-weight: 700; line-height: 1.2; letter-spacing: -0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${isSpanish ? `Gracias, ${quote.contact.firstName}` : `Thank you, ${quote.contact.firstName}`}</h1>
      <p class="dm-text-secondary" style="margin: 0; color: ${BRAND.textSecondary}; font-size: 16px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${isSpanish ? 'Hemos recibido su solicitud de cotización. Un especialista revisará los detalles y se comunicará con usted dentro de un día hábil.' : "We've received your quote request. A specialist will review the details and reach out within one business day."}</p>
    </td>
  </tr>`;

  const refSection = `<tr>
    <td class="dm-surface px-card" style="background-color: ${BRAND.surface}; padding: 24px 32px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="dm-surface-muted dm-border" style="background-color: ${BRAND.surfaceMuted}; border: 1px solid ${BRAND.border}; border-left: 3px solid ${BRAND.accent}; border-radius: 8px;">
        <tr><td style="padding: 20px 24px;">
          <p class="dm-text-secondary" style="margin: 0 0 6px; color: ${BRAND.textMuted}; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${isSpanish ? 'Número de Referencia' : 'Reference Number'}</p>
          <p class="ref-value dm-text-primary" style="margin: 0; color: ${BRAND.textPrimary}; font-size: 24px; font-weight: 700; letter-spacing: 2px; font-family: 'SF Mono', Menlo, Monaco, Consolas, monospace;">${quote.referenceId}</p>
          <p class="dm-text-secondary" style="margin: 8px 0 0; color: ${BRAND.textMuted}; font-size: 12px; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${isSpanish ? 'Guarde este número para sus registros.' : 'Save this number for your records.'}</p>
        </td></tr>
      </table>
    </td>
  </tr>`;

  const steps = isSpanish
    ? [
        {
          n: '1',
          t: 'Revisión',
          d: 'Revisaremos los detalles de su vehículo y daños cuidadosamente.',
        },
        {
          n: '2',
          t: 'Contacto',
          d: `Le contactaremos por ${preferred} dentro de un día hábil.`,
        },
        {
          n: '3',
          t: 'Inspección',
          d: 'Programaremos su evaluación a su conveniencia.',
        },
      ]
    : [
        {
          n: '1',
          t: 'Review',
          d: 'We carefully review your vehicle and damage details.',
        },
        {
          n: '2',
          t: 'Contact',
          d: `We reach out by ${preferred} within one business day.`,
        },
        {
          n: '3',
          t: 'Inspection',
          d: 'We schedule your assessment at your convenience.',
        },
      ];

  const stepsInner = steps
    .map(
      (s, i) => `<tr>
    <td valign="top" style="width: 48px; padding: ${i === 0 ? '4px' : '12px'} 16px 4px 0;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="width: 32px; height: 32px; background-color: ${BRAND.headerBg}; color: ${BRAND.headerText}; border-radius: 50%; text-align: center; font-size: 13px; font-weight: 700; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${s.n}</td></tr></table>
    </td>
    <td valign="top" style="padding: ${i === 0 ? '4px' : '12px'} 0 4px;">
      <p class="dm-text-primary" style="margin: 0 0 2px; color: ${BRAND.textPrimary}; font-size: 15px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${s.t}</p>
      <p class="dm-text-secondary" style="margin: 0; color: ${BRAND.textSecondary}; font-size: 14px; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${s.d}</p>
    </td>
  </tr>`,
    )
    .join('');

  const stepsSection = sectionCard(
    isSpanish ? 'Próximos Pasos' : 'What Happens Next',
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 4px;">${stepsInner}</table>`,
  );

  const summaryRows = [
    dataRow(isSpanish ? 'Servicio' : 'Service', serviceLabel, true),
    dataRow(isSpanish ? 'Vehículo' : 'Vehicle', vehicleStr),
    quote.vehicle.vin
      ? dataRow(
          'VIN',
          `<span style="font-family: 'SF Mono', Menlo, Monaco, Consolas, monospace; font-size: 13px;">${quote.vehicle.vin}</span>`,
        )
      : '',
    dataRow(
      isSpanish ? 'Daño' : 'Damage',
      `<span style="display: inline-block; padding: 4px 10px; background-color: ${sev.bg}; color: ${sev.text}; border: 1px solid ${sev.border}; border-radius: 999px; font-size: 12px; font-weight: 600;">${severityLabel}</span>`,
    ),
  ]
    .filter(Boolean)
    .join('');

  const summarySection = sectionCard(
    isSpanish ? 'Resumen de su Solicitud' : 'Your Request',
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${summaryRows}</table>`,
  );

  let photosSection = '';
  if (photoUrls.length > 0) {
    photosSection = sectionCard(
      isSpanish ? 'Fotos Adjuntas' : 'Attached Photos',
      `<div style="padding: 12px 0 4px;">${photoGrid(photoUrls, isSpanish ? 'Foto' : 'Photo')}</div>`,
    );
  }

  const closingSection = `<tr>
    <td class="dm-surface px-card" style="background-color: ${BRAND.surface}; padding: 28px 32px 36px;">
      <p class="dm-text-secondary" style="margin: 0; color: ${BRAND.textSecondary}; font-size: 14px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${isSpanish ? '¿Preguntas?' : 'Questions?'} ${isSpanish ? 'Responda a este correo o llámenos al' : 'Reply to this email or call us at'} <a href="tel:+17146305959" style="color: ${BRAND.accent}; font-weight: 600; text-decoration: none;">(714) 630-5959</a>.</p>
    </td>
  </tr>`;

  return emailShell({
    preheader: isSpanish
      ? `Su número de referencia es ${quote.referenceId}. Le contactaremos pronto.`
      : `Your reference number is ${quote.referenceId}. We'll be in touch soon.`,
    locale: quote.metadata.locale,
    bodyHtml:
      heroSection +
      refSection +
      stepsSection +
      summarySection +
      photosSection +
      closingSection,
  });
}

function generateShopEmailHtml(
  quote: QuoteRequest,
  photoUrls: string[],
): string {
  const isSpanish = quote.metadata.locale === 'es';
  const serviceLabel =
    SERVICE_LABELS[quote.service]?.[isSpanish ? 'es' : 'en'] ?? quote.service;
  const vehicleStr = `${quote.vehicle.year} ${quote.vehicle.make}${quote.vehicle.model ? ` ${quote.vehicle.model}` : ''}`;
  const sev = SEVERITY_STYLE[quote.damage.severity] ?? SEVERITY_STYLE.unsure;
  const severityLabel = isSpanish ? sev.es : sev.en;
  const customerName = `${quote.contact.firstName}${quote.contact.lastName ? ` ${quote.contact.lastName}` : ''}`;
  const phoneDisplay = formatPhoneDisplay(quote.contact.phone);
  const submittedStr = new Date(quote.metadata.submittedAt).toLocaleString(
    isSpanish ? 'es-US' : 'en-US',
    { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' },
  );

  const heroSection = `<tr>
    <td class="dm-surface px-card" style="background-color: ${BRAND.surface}; padding: 36px 32px 24px;">
      <p style="margin: 0 0 10px; color: ${BRAND.accent}; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${isSpanish ? 'Nueva Solicitud de Cotización' : 'New Quote Request'}</p>
      <h1 class="h1 dm-text-primary" style="margin: 0 0 18px; color: ${BRAND.textPrimary}; font-size: 26px; font-weight: 700; line-height: 1.25; letter-spacing: -0.4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${customerName} <span class="dm-text-secondary" style="color: ${BRAND.textSecondary}; font-weight: 500;">·</span> ${vehicleStr}</h1>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="pill-row">
        <tr>
          <td style="padding-right: 8px;"><span style="display: inline-block; padding: 6px 12px; background-color: ${BRAND.headerBg}; color: ${BRAND.headerText}; border-radius: 6px; font-size: 12px; font-weight: 600; font-family: 'SF Mono', Menlo, Monaco, Consolas, monospace; letter-spacing: 0.5px;">${quote.referenceId}</span></td>
          <td style="padding-right: 8px;"><span style="display: inline-block; padding: 6px 12px; background-color: ${sev.bg}; color: ${sev.text}; border: 1px solid ${sev.border}; border-radius: 6px; font-size: 12px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${severityLabel}</span></td>
          <td><span class="dm-text-secondary" style="color: ${BRAND.textMuted}; font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${submittedStr}</span></td>
        </tr>
      </table>
    </td>
  </tr>`;

  const contactSection = `<tr>
    <td class="dm-surface px-card" style="background-color: ${BRAND.surface}; padding: 0 32px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="dm-surface-muted dm-border" style="background-color: ${BRAND.surfaceMuted}; border: 1px solid ${BRAND.border}; border-radius: 8px;">
        <tr><td style="padding: 20px 24px;">
          <p class="dm-text-secondary" style="margin: 0 0 14px; color: ${BRAND.textMuted}; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${isSpanish ? 'Contactar Cliente' : 'Contact Customer'} · ${isSpanish ? 'prefiere' : 'prefers'} ${quote.contact.preferredMethod}</p>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding-right: 10px; padding-bottom: 8px;"><a href="tel:${quote.contact.phone}" class="action-btn" style="display: inline-block; padding: 11px 18px; background-color: ${BRAND.headerBg}; color: ${BRAND.headerText}; border-radius: 6px; font-size: 14px; font-weight: 600; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${phoneDisplay}</a></td>
              <td style="padding-bottom: 8px;"><a href="mailto:${quote.contact.email}" class="action-btn dm-text-primary dm-border" style="display: inline-block; padding: 11px 18px; background-color: ${BRAND.surface}; color: ${BRAND.textPrimary}; border: 1px solid ${BRAND.border}; border-radius: 6px; font-size: 14px; font-weight: 600; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${quote.contact.email}</a></td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td>
  </tr>`;

  const vehicleRows = [
    dataRow(isSpanish ? 'Servicio' : 'Service', serviceLabel, true),
    dataRow(isSpanish ? 'Año' : 'Year', String(quote.vehicle.year)),
    dataRow(isSpanish ? 'Marca' : 'Make', quote.vehicle.make),
    quote.vehicle.model
      ? dataRow(isSpanish ? 'Modelo' : 'Model', quote.vehicle.model)
      : '',
    quote.vehicle.vin
      ? dataRow(
          'VIN',
          `<span style="font-family: 'SF Mono', Menlo, Monaco, Consolas, monospace; font-size: 13px;">${quote.vehicle.vin}</span>`,
        )
      : '',
  ]
    .filter(Boolean)
    .join('');

  const vehicleSection = sectionCard(
    isSpanish ? 'Vehículo' : 'Vehicle',
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${vehicleRows}</table>`,
  );

  const damageRows = [
    dataRow(
      isSpanish ? 'Severidad' : 'Severity',
      `<span style="display: inline-block; padding: 4px 10px; background-color: ${sev.bg}; color: ${sev.text}; border: 1px solid ${sev.border}; border-radius: 999px; font-size: 12px; font-weight: 600;">${severityLabel}</span>`,
      true,
    ),
    quote.damage.description
      ? dataRow(
          isSpanish ? 'Descripción' : 'Description',
          quote.damage.description,
        )
      : '',
  ]
    .filter(Boolean)
    .join('');

  const damageSection = sectionCard(
    isSpanish ? 'Daños' : 'Damage',
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${damageRows}</table>`,
  );

  let appointmentSection = '';
  if (quote.appointment?.date) {
    const apptStr = `${quote.appointment.date}${quote.appointment.time ? ` · ${quote.appointment.time}` : ''}`;
    const apptRows = [
      dataRow(isSpanish ? 'Solicitada' : 'Requested', apptStr, true),
      quote.appointment.notes
        ? dataRow(isSpanish ? 'Notas' : 'Notes', quote.appointment.notes)
        : '',
    ]
      .filter(Boolean)
      .join('');
    appointmentSection = sectionCard(
      isSpanish ? 'Cita Preferida' : 'Preferred Appointment',
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${apptRows}</table>`,
    );
  }

  let photosSection = '';
  if (photoUrls.length > 0) {
    photosSection = sectionCard(
      `${isSpanish ? 'Fotos de Daño' : 'Damage Photos'} (${photoUrls.length})`,
      `<div style="padding: 12px 0 4px;">${photoGrid(photoUrls, isSpanish ? 'Foto de daño' : 'Damage photo')}</div>`,
    );
  }

  const metaSection = `<tr>
    <td class="dm-surface px-card" style="background-color: ${BRAND.surface}; padding: 24px 32px 32px;">
      <p class="dm-text-secondary" style="margin: 0; color: ${BRAND.textMuted}; font-size: 11px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
        ${isSpanish ? 'Idioma' : 'Locale'}: ${quote.metadata.locale.toUpperCase()} · ${isSpanish ? 'Origen' : 'Source'}: ${quote.metadata.source} · ${isSpanish ? 'Tiempo en formulario' : 'Form time'}: ${Math.round(quote.metadata.submissionDurationMs / 1000)}s
      </p>
    </td>
  </tr>`;

  return emailShell({
    preheader: `${customerName} · ${vehicleStr} · ${severityLabel} · ${quote.referenceId}`,
    locale: quote.metadata.locale,
    bodyHtml:
      heroSection +
      contactSection +
      vehicleSection +
      damageSection +
      appointmentSection +
      photosSection +
      metaSection,
  });
}

async function sendEmails(
  quote: QuoteRequest,
  photoUrls: string[],
): Promise<{ shopSent: boolean; customerSent: boolean }> {
  if (!resend) {
    console.warn('Resend not configured, skipping email notifications');
    return { shopSent: false, customerSent: false };
  }

  const fromEmail = process.env.FROM_EMAIL || 'quotes@prestigeautobody.com';
  const shopEmail = process.env.SHOP_EMAIL || 'quotes@prestigeautobody.com';
  const locale = quote.metadata.locale;

  let shopSent = false;
  let customerSent = false;

  try {
    // Send shop notification
    await resend.emails.send({
      from: fromEmail,
      to: shopEmail,
      subject:
        locale === 'es'
          ? `Nueva Solicitud - ${quote.referenceId}`
          : `New Quote Request - ${quote.referenceId}`,
      html: generateShopEmailHtml(quote, photoUrls),
    });
    shopSent = true;
  } catch (error) {
    console.error('Failed to send shop email:', error);
  }

  try {
    // Send customer confirmation
    await resend.emails.send({
      from: fromEmail,
      to: quote.contact.email,
      subject:
        locale === 'es'
          ? 'Gracias por su solicitud de cotización'
          : 'Thank You for Your Quote Request',
      html: generateCustomerEmailHtml(quote, photoUrls),
    });
    customerSent = true;
  } catch (error) {
    console.error('Failed to send customer email:', error);
  }

  return { shopSent, customerSent };
}

// ============================================================================
// Error Response Helpers
// ============================================================================

function errorResponse(
  status: number,
  error: string,
  message: string,
  fields?: Record<string, string[]>,
  retryAfter?: number,
) {
  const headers: Record<string, string> = {};
  if (retryAfter) {
    headers['Retry-After'] = String(retryAfter);
  }

  return NextResponse.json(
    { error, message, ...(fields && { fields }) },
    { status, headers },
  );
}

// ============================================================================
// Main POST Handler
// ============================================================================

export async function POST(request: Request) {
  const startTime = Date.now();
  const contentType = request.headers.get('content-type') || '';
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const ipHash = hashIp(ip);

  try {
    // Check rate limit — fail open: a rate-limiter outage (Upstash down,
    // missing permissions, network blip) must not block real submissions.
    const rateLimiter = getRatelimit();
    if (rateLimiter) {
      try {
        const { success, reset } = await rateLimiter.limit(ipHash);
        if (!success) {
          const retryAfter = Math.ceil((reset - Date.now()) / 1000);
          return errorResponse(
            429,
            'rate_limit',
            'Too many submissions. Please try again later.',
            undefined,
            retryAfter,
          );
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.warn(
          JSON.stringify({
            event: 'rate_limiter_degraded',
            level: 'warn',
            route: 'api/quote',
            ipHash,
            errorName: err.name,
            errorMessage: err.message,
            timestamp: new Date().toISOString(),
          }),
        );
      }
    }

    let fields: Record<string, string> = {};
    let files: ParsedFormData['files'] = [];
    const isMultipart = contentType.includes('multipart/form-data');

    // Parse request body based on content type
    if (isMultipart) {
      // Check Content-Length for file bomb guard
      const contentLength = request.headers.get('content-length');
      if (
        contentLength &&
        parseInt(contentLength) > MAX_TOTAL_SIZE + 2 * 1024 * 1024
      ) {
        return errorResponse(
          413,
          'payload_too_large',
          'Total upload size exceeds 20 MB limit.',
        );
      }

      try {
        const parsed = await parseMultipartFormData(request);
        fields = parsed.fields;
        files = parsed.files;
      } catch (error) {
        console.error('Multipart parsing error:', error);
        return errorResponse(
          400,
          'invalid_multipart',
          'Failed to parse multipart form data.',
        );
      }
    } else {
      // Parse JSON body
      try {
        const jsonBody = await request.json();
        fields = Object.entries(jsonBody).reduce(
          (acc, [key, value]) => {
            acc[key] =
              typeof value === 'object' ? JSON.stringify(value) : String(value);
            return acc;
          },
          {} as Record<string, string>,
        );
      } catch {
        return errorResponse(400, 'invalid_json', 'Invalid JSON body.');
      }
    }

    // Honeypot check - silently drop if triggered
    if (fields._gotcha || fields._honeypot) {
      return NextResponse.json(
        { referenceId: 'PAB-BOT-DETECTED' },
        { status: 201 },
      );
    }

    // Sanitize and parse fields
    const service = sanitizeInput(fields.service || '');
    const vehicleYear = parseInt(
      fields['vehicle.year'] || fields.vehicleYear || '0',
      10,
    );
    const vehicleMake = sanitizeInput(
      fields['vehicle.make'] || fields.vehicleMake || '',
    );
    const vehicleModel = sanitizeInput(
      fields['vehicle.model'] || fields.vehicleModel || '',
    );
    const vehicleVin = sanitizeInput(fields['vehicle.vin'] || '')
      .toUpperCase()
      .replace(/\s+/g, '');
    const damageSeverity = sanitizeInput(
      fields['damage.severity'] || fields.damageSeverity || '',
    );
    const damageDescription = sanitizeInput(
      fields['damage.description'] || fields.damageDescription || '',
    );
    const hasPhotos =
      fields.hasPhotos === 'true' ||
      fields.hasPhotos === 'true' ||
      files.length > 0;
    const firstName = sanitizeInput(
      fields['contact.firstName'] || fields.firstName || '',
    );
    const lastName = sanitizeInput(
      fields['contact.lastName'] || fields.lastName || '',
    );
    const phone = normalizePhone(fields['contact.phone'] || fields.phone || '');
    const email = sanitizeInput(
      fields['contact.email'] || fields.email || '',
    ).toLowerCase();
    const preferredMethod = sanitizeInput(
      fields['contact.preferredMethod'] || fields.preferredMethod || 'phone',
    );
    const appointmentDate = fields['appointment.date'] || undefined;
    const appointmentTime = fields['appointment.time'] || undefined;
    const appointmentNotes = sanitizeInput(
      fields['appointment.notes'] || fields.notes || '',
    );
    const locale = fields['metadata.locale'] || fields.locale || 'en';
    const source = fields['metadata.source'] || 'website';
    const submittedAt =
      fields['metadata.submittedAt'] || new Date().toISOString();
    const formLoadedAt = parseInt(fields['metadata.formLoadedAt'] || '0', 10);
    const userAgent =
      fields['metadata.userAgent'] || request.headers.get('user-agent') || '';

    // Calculate submission duration
    const submittedAtTime = new Date(submittedAt).getTime();
    const submissionDurationMs =
      formLoadedAt > 0
        ? submittedAtTime - formLoadedAt
        : Date.now() - startTime;

    // Time-based spam check - reject if < 3 seconds
    if (formLoadedAt > 0 && submissionDurationMs < MIN_SUBMISSION_TIME) {
      return errorResponse(
        400,
        'too_fast',
        'Submission was too quick. Please take your time filling out the form.',
      );
    }

    // Validate files if present
    if (files.length > 0) {
      const { valid, errors } = await validateFiles(files);

      if (errors.length > 0 && valid.length === 0) {
        return errorResponse(400, 'invalid_files', 'File validation failed.', {
          files: errors,
        });
      }

      files = valid;
    }

    // Build quote data
    const quoteData = {
      service,
      vehicle: {
        year: vehicleYear,
        make: vehicleMake,
        model: vehicleModel,
        ...(vehicleVin ? { vin: vehicleVin } : {}),
      },
      damage: {
        severity: damageSeverity,
        description: damageDescription,
        hasPhotos,
      },
      contact: {
        firstName,
        lastName,
        phone,
        email,
        preferredMethod,
      },
      appointment: appointmentDate
        ? {
            date: appointmentDate,
            time: appointmentTime,
            notes: appointmentNotes,
          }
        : null,
      metadata: {
        locale,
        source,
        submittedAt,
        formLoadedAt,
        submissionDurationMs,
        userAgent,
        ipHash,
      },
      honeypotTriggered: false,
    };

    // Validate with Zod
    const validationResult = quoteSchema.safeParse(quoteData);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string[]> = {};
      validationResult.error.issues.forEach((err: z.ZodIssue) => {
        const path = err.path.join('.');
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(err.message);
      });

      return errorResponse(
        400,
        'validation',
        'Validation failed.',
        fieldErrors,
      );
    }

    // Generate reference ID
    const referenceId = generateReferenceId();

    // Get Payload instance
    const payload = await getPayload();

    // Upload files to Payload media collection
    const mediaIds: string[] = [];
    const photoUrls: string[] = [];

    if (files.length > 0) {
      const uploadResults = await Promise.all(
        files.map(async (file) => {
          const mediaId = await uploadMediaToPayload(
            payload,
            file,
            referenceId,
          );
          return mediaId;
        }),
      );

      mediaIds.push(...uploadResults.filter((id): id is string => id !== null));
    }

    // Create quote request document
    const quoteRequest: QuoteRequest = {
      ...validationResult.data,
      referenceId,
      damage: {
        ...validationResult.data.damage,
        damagePhotos: mediaIds,
      },
      status: 'new',
    };

    await createQuoteRequest(payload, quoteRequest);

    // Generate URLs for photos
    if (mediaIds.length > 0) {
      for (const mediaId of mediaIds) {
        try {
          const mediaDoc = await payload.findByID({
            collection: 'media',
            id: mediaId,
          });
          if (mediaDoc?.url) {
            photoUrls.push(mediaDoc.url);
          }
        } catch (e) {
          console.error('Failed to get media URL:', e);
        }
      }
    }

    // Send email notifications
    const { shopSent, customerSent } = await sendEmails(
      quoteRequest,
      photoUrls,
    );

    // Log email status
    console.log(
      `Quote ${referenceId}: Shop email ${shopSent ? 'sent' : 'failed'}, Customer email ${customerSent ? 'sent' : 'failed'}`,
    );

    // Return success response
    return NextResponse.json(
      {
        referenceId,
        photoCount: mediaIds.length,
        status: 'received',
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Quote submission error:', error);
    return errorResponse(
      500,
      'server_error',
      'An unexpected error occurred. Please try again later.',
    );
  }
}
