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
  service: string;
  vehicle: {
    year: number;
    make: string;
    model?: string;
  };
  damage: {
    severity: string;
    description?: string;
    hasPhotos: boolean;
    damagePhotos?: string[];
  };
  contact: {
    firstName: string;
    lastName?: string;
    phone: string;
    email: string;
    preferredMethod: string;
  };
  appointment?: {
    date?: string;
    time?: string;
    notes?: string;
  } | null;
  metadata: {
    locale: string;
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

function generateShopEmailHtml(
  quote: QuoteRequest,
  photoUrls: string[],
): string {
  const locale = quote.metadata.locale;
  const isSpanish = locale === 'es';

  return `
<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background: #1e40af; color: white; padding: 20px; }
    .content { padding: 20px; }
    .section { margin-bottom: 20px; }
    .label { font-weight: bold; color: #666; }
    .photos { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
    .photo { border: 1px solid #ddd; border-radius: 4px; overflow: hidden; }
    .photo img { width: 100%; height: auto; display: block; }
    .footer { background: #f3f4f6; padding: 20px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${isSpanish ? 'Nueva Solicitud de Cotización' : 'New Quote Request'}</h1>
    <p>${isSpanish ? 'Referencia' : 'Reference'}: ${quote.referenceId}</p>
  </div>
  
  <div class="content">
    <div class="section">
      <p class="label">${isSpanish ? 'Servicio' : 'Service'}:</p>
      <p>${quote.service}</p>
    </div>
    
    <div class="section">
      <p class="label">${isSpanish ? 'Vehículo' : 'Vehicle'}:</p>
      <p>${quote.vehicle.year} ${quote.vehicle.make} ${quote.vehicle.model || ''}</p>
    </div>
    
    <div class="section">
      <p class="label">${isSpanish ? 'Daño' : 'Damage'}:</p>
      <p>${isSpanish ? 'Severidad' : 'Severity'}: ${quote.damage.severity}</p>
      ${quote.damage.description ? `<p>${quote.damage.description}</p>` : ''}
    </div>
    
    <div class="section">
      <p class="label">${isSpanish ? 'Contacto' : 'Contact'}:</p>
      <p>${quote.contact.firstName} ${quote.contact.lastName || ''}</p>
      <p>${isSpanish ? 'Teléfono' : 'Phone'}: ${quote.contact.phone}</p>
      <p>Email: ${quote.contact.email}</p>
      <p>${isSpanish ? 'Preferencia' : 'Preference'}: ${quote.contact.preferredMethod}</p>
    </div>
    
    ${
      quote.appointment?.date
        ? `
    <div class="section">
      <p class="label">${isSpanish ? 'Cita Preferida' : 'Preferred Appointment'}:</p>
      <p>${quote.appointment.date}${quote.appointment.time ? ` at ${quote.appointment.time}` : ''}</p>
      ${quote.appointment.notes ? `<p>${quote.appointment.notes}</p>` : ''}
    </div>
    `
        : ''
    }
    
    ${
      photoUrls.length > 0
        ? `
    <div class="section">
      <p class="label">${isSpanish ? 'Fotos de Daño' : 'Damage Photos'} (${photoUrls.length}):</p>
      <div class="photos">
        ${photoUrls
          .map(
            (url, i) => `
          <div class="photo">
            <img src="${url}" alt="${isSpanish ? `Foto de daño ${i + 1}` : `Damage photo ${i + 1}`}" />
          </div>
        `,
          )
          .join('')}
      </div>
    </div>
    `
        : ''
    }
  </div>
  
  <div class="footer">
    <p>${isSpanish ? 'Enviado el' : 'Submitted on'}: ${new Date(quote.metadata.submittedAt).toLocaleString(locale)}</p>
    <p>${isSpanish ? 'Duración del formulario' : 'Form duration'}: ${Math.round(quote.metadata.submissionDurationMs / 1000)}s</p>
  </div>
</body>
</html>
  `;
}

function generateCustomerEmailHtml(
  quote: QuoteRequest,
  photoUrls: string[],
): string {
  const locale = quote.metadata.locale;
  const isSpanish = locale === 'es';

  return `
<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; max-width: 600px; margin: 0 auto; }
    .section { margin-bottom: 20px; }
    .reference { background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; font-size: 18px; margin: 20px 0; }
    .reference strong { color: #1e40af; font-size: 24px; }
    .photos { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 15px; }
    .photo { border: 1px solid #ddd; border-radius: 4px; overflow: hidden; }
    .photo img { width: 100%; height: 150px; object-fit: cover; display: block; }
    .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #666; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${isSpanish ? '¡Gracias por su solicitud!' : 'Thank You for Your Request!'}</h1>
  </div>
  
  <div class="content">
    <p>${
      isSpanish
        ? `Hola ${quote.contact.firstName}, hemos recibido su solicitud de cotización y nos pondremos en contacto con usted pronto.`
        : `Hi ${quote.contact.firstName}, we've received your quote request and will contact you soon.`
    }</p>
    
    <div class="reference">
      <p>${isSpanish ? 'Su número de referencia:' : 'Your reference number:'}</p>
      <strong>${quote.referenceId}</strong>
    </div>
    
    <div class="section">
      <p><strong>${isSpanish ? 'Resumen de su solicitud:' : 'Your request summary:'}</strong></p>
      <p>${isSpanish ? 'Servicio' : 'Service'}: ${quote.service}</p>
      <p>${isSpanish ? 'Vehículo' : 'Vehicle'}: ${quote.vehicle.year} ${quote.vehicle.make} ${quote.vehicle.model || ''}</p>
      <p>${isSpanish ? 'Daño' : 'Damage'}: ${quote.damage.severity}</p>
    </div>
    
    ${
      photoUrls.length > 0
        ? `
    <div class="section">
      <p><strong>${isSpanish ? 'Fotos adjuntas' : 'Attached photos'}:</strong></p>
      <div class="photos">
        ${photoUrls
          .map(
            (url, i) => `
          <div class="photo">
            <img src="${url}" alt="${isSpanish ? `Foto ${i + 1}` : `Photo ${i + 1}`}" />
          </div>
        `,
          )
          .join('')}
      </div>
    </div>
    `
        : ''
    }
    
    <p>${
      isSpanish
        ? 'Si tiene alguna pregunta, no dude en contactarnos.'
        : "If you have any questions, please don't hesitate to contact us."
    }</p>
  </div>
  
  <div class="footer">
    <p><strong>Prestige Auto Body Inc.</strong></p>
    <p>1161 N Tustin Ave, Anaheim, CA 92807</p>
    <p>(714) 630-5959</p>
  </div>
</body>
</html>
  `;
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
    // Check rate limit
    const rateLimiter = getRatelimit();
    if (rateLimiter) {
      const { success, limit, reset } = await rateLimiter.limit(ipHash);
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
