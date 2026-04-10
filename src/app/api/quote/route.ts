import { NextResponse } from 'next/server';
import { z } from 'zod';

const quoteSchema = z.object({
  service: z.enum(['collision', 'bodywork', 'painting', 'insurance']),
  vehicle: z.object({
    year: z
      .number()
      .int()
      .min(1990)
      .max(new Date().getFullYear() + 1),
    make: z.string().min(1).max(50),
    model: z.string().max(50).optional(),
  }),
  damage: z.object({
    severity: z.enum(['minor', 'moderate', 'major', 'unsure']),
    description: z.string().max(500).optional(),
    hasPhotos: z.boolean().optional(),
  }),
  contact: z.object({
    firstName: z.string().min(1).max(50),
    lastName: z.string().max(50).optional(),
    phone: z.string().regex(/^\d{10,15}$/),
    email: z.string().email(),
    preferredMethod: z.enum(['phone', 'text', 'email']).optional(),
  }),
  metadata: z
    .object({
      source: z.string(),
      page: z.string(),
      submittedAt: z.string(),
      locale: z.string(),
      userAgent: z.string(),
    })
    .optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot check — silently reject bots
    if (body._honeypot) {
      return NextResponse.json({ id: 'fake-id' }, { status: 201 });
    }

    quoteSchema.parse(body);

    // TODO: Store in Payload CMS `quote-requests` collection
    // TODO: Send notification email to estimator team
    // TODO: Send confirmation to customer

    return NextResponse.json(
      { id: crypto.randomUUID(), status: 'received' },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
