import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { PayloadInstance, BlogPost } from '@/types/payload';

// ============================================================================
// Zod Schema Validation for Blog Draft Creation
// ============================================================================

const blogDraftSchema = z.object({
  // Required fields
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  excerpt: z.string().min(10).max(500),
  content: z.object({}).passthrough(), // Lexical rich text JSON

  // Categories - array of category slugs
  categories: z.array(z.string()).min(1),

  // Author - team member slug
  authorSlug: z.string().min(1),

  // Optional fields
  locale: z.enum(['en', 'es']).default('en'),
  status: z.enum(['draft', 'published']).default('draft'),

  // SEO fields
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  focusKeyword: z.string().optional(),
  ogImageUrl: z.string().url().optional(),

  // Automation metadata
  workflowId: z.string().optional(),
  executionId: z.string().optional(),
  contentSource: z.enum(['ai', 'manual', 'import']).default('ai'),

  // Tags
  tags: z.array(z.string()).optional(),
});

// ============================================================================
// Payload CMS Integration
// ============================================================================

async function getPayload(): Promise<PayloadInstance> {
  const { getPayload } = await import('payload');
  const config = await import('@/payload/payload.config');
  return getPayload({ config: config.default }) as Promise<PayloadInstance>;
}

async function findCategoryIdsBySlugs(
  payload: PayloadInstance,
  slugs: string[],
): Promise<{ ids: string[]; errors: string[] }> {
  const ids: string[] = [];
  const errors: string[] = [];

  for (const slug of slugs) {
    try {
      const result = await payload.find<{ id: string; slug: string }>({
        collection: 'blog-categories',
        where: {
          slug: {
            equals: slug,
          },
        },
      });

      if (result.docs.length > 0) {
        ids.push(result.docs[0].id);
      } else {
        errors.push(`Category not found: ${slug}`);
      }
    } catch (error) {
      errors.push(`Error finding category ${slug}: ${error}`);
    }
  }

  return { ids, errors };
}

async function findAuthorIdBySlug(
  payload: PayloadInstance,
  slug: string,
): Promise<string | null> {
  try {
    const result = await payload.find<{ id: string; slug: string }>({
      collection: 'team-members',
      where: {
        slug: {
          equals: slug,
        },
      },
    });

    if (result.docs.length > 0) {
      return result.docs[0].id;
    }
  } catch (error) {
    console.error(`Error finding author ${slug}:`, error);
  }
  return null;
}

async function uploadOGImageFromURL(
  payload: PayloadInstance,
  imageUrl: string,
  postTitle: string,
): Promise<string | null> {
  try {
    // Fetch image from URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Generate filename from URL
    const urlParts = new URL(imageUrl);
    const pathParts = urlParts.pathname.split('/');
    const originalFilename = pathParts[pathParts.length - 1] || 'og-image.jpg';
    const filename = `${Date.now()}-${originalFilename}`;

    // Create media document
    const media = await payload.create<{ id: string }>({
      collection: 'media',
      data: {
        alt: {
          en: `Featured image for: ${postTitle}`,
          es: `Imagen destacada para: ${postTitle}`,
        },
      },
      file: {
        data: buffer,
        mimetype: contentType,
        name: filename,
        size: buffer.length,
      },
    });

    return media.id;
  } catch (error) {
    console.error('Failed to upload OG image:', error);
    return null;
  }
}

async function createBlogDraft(
  payload: PayloadInstance,
  data: z.infer<typeof blogDraftSchema>,
): Promise<{ blogPost: BlogPost; warnings?: string[] }> {
  // Find category IDs
  const { ids: categoryIds, errors: categoryErrors } =
    await findCategoryIdsBySlugs(payload, data.categories);

  if (categoryIds.length === 0) {
    throw new Error(
      `No valid categories found. Errors: ${categoryErrors.join(', ')}`,
    );
  }

  // Find author ID
  const authorId = await findAuthorIdBySlug(payload, data.authorSlug);
  if (!authorId) {
    throw new Error(`Author not found: ${data.authorSlug}`);
  }

  // Upload OG image if URL provided
  let ogImageId: string | undefined;
  if (data.ogImageUrl) {
    ogImageId =
      (await uploadOGImageFromURL(payload, data.ogImageUrl, data.title)) ||
      undefined;
  }

  // Prepare tags array
  const tagsArray = data.tags?.map((tag) => ({ tag })) || [];

  // Create the blog post
  const blogPost = await payload.create<BlogPost>({
    collection: 'blog-posts',
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      categories: categoryIds,
      author: authorId,
      locale: data.locale,
      status: data.status,
      meta: {
        title: data.metaTitle,
        description: data.metaDescription,
        focusKeyword: data.focusKeyword,
        ogImage: ogImageId,
      },
      tags: tagsArray,
      n8nSource: {
        workflowId: data.workflowId,
        executionId: data.executionId,
        triggeredAt: new Date().toISOString(),
        contentSource: data.contentSource,
      },
    },
  });

  return {
    blogPost,
    warnings: categoryErrors.length > 0 ? categoryErrors : undefined,
  };
}

// ============================================================================
// Error Response Helper
// ============================================================================

function errorResponse(
  status: number,
  error: string,
  message: string,
  details?: Record<string, unknown> | Array<Record<string, string>>,
) {
  return NextResponse.json(
    { success: false, error, message, ...(details && { details }) },
    { status },
  );
}

// ============================================================================
// Main POST Handler
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const webhookSecret = request.headers.get('x-n8n-webhook-secret');
    const expectedSecret = process.env.N8N_WEBHOOK_SECRET;

    if (expectedSecret && webhookSecret !== expectedSecret) {
      return errorResponse(401, 'unauthorized', 'Invalid webhook secret');
    }

    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse(400, 'invalid_json', 'Invalid JSON body');
    }

    // Validate request body
    const validationResult = blogDraftSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
      return errorResponse(
        400,
        'validation_error',
        'Request validation failed',
        errors,
      );
    }

    const data = validationResult.data;

    // Ensure status is always draft (never auto-publish)
    if (data.status === 'published') {
      console.warn('Auto-publish attempted, forcing draft status');
      data.status = 'draft';
    }

    // Get Payload instance
    const payload = await getPayload();

    // Create the blog draft
    const result = await createBlogDraft(payload, data);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Blog draft created successfully',
        data: {
          id: result.blogPost.id,
          slug: result.blogPost.slug,
          title: result.blogPost.title,
          status: result.blogPost.status,
          locale: result.blogPost.locale,
          cmsUrl: `/admin/collections/blog-posts/${result.blogPost.id}`,
        },
        warnings: result.warnings,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Blog draft creation error:', error);
    return errorResponse(
      500,
      'server_error',
      error instanceof Error ? error.message : 'Failed to create blog draft',
    );
  }
}
