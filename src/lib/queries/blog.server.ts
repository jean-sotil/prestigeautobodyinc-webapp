/**
 * Server-side blog query utilities for React Server Components.
 * Uses Payload's Local API — direct DB access, no HTTP hop, safe at build time.
 */

import 'server-only';
import type { BlogPost, BlogPostsResponse } from './types';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

interface FetchBlogPostsOptions {
  locale: string;
  page?: number;
  limit?: number;
  category?: string;
}

async function getPayloadClient() {
  const { getPayload } = await import('payload');
  const config = await import('@/payload/payload.config');
  return getPayload({ config: config.default });
}

const EMPTY_RESPONSE: BlogPostsResponse = {
  docs: [],
  totalDocs: 0,
  totalPages: 0,
  page: 1,
  hasNextPage: false,
  hasPrevPage: false,
  nextPage: null,
  prevPage: null,
};

export async function fetchBlogPosts({
  locale,
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
  category,
}: FetchBlogPostsOptions): Promise<BlogPostsResponse> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'blog-posts',
      depth: 2,
      page,
      limit,
      sort: '-publishedAt',
      locale: locale as 'en' | 'es',
      where: {
        and: [
          { status: { equals: 'published' } },
          ...(category ? [{ 'categories.slug': { equals: category } }] : []),
        ],
      },
    });

    return {
      docs: result.docs as unknown as BlogPost[],
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page ?? 1,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
      nextPage: result.nextPage ?? null,
      prevPage: result.prevPage ?? null,
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return EMPTY_RESPONSE;
  }
}

export async function fetchBlogPostBySlug(
  slug: string,
  locale: string,
): Promise<BlogPost | null> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'blog-posts',
      depth: 2,
      limit: 1,
      locale: locale as 'en' | 'es',
      where: {
        and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
      },
    });

    if (!result.docs || result.docs.length === 0) return null;
    return result.docs[0] as unknown as BlogPost;
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return null;
  }
}

export async function fetchBlogCategories(locale: string): Promise<
  Array<{
    id: string;
    slug: string;
    name: string;
    description?: string;
  }>
> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'blog-categories',
      depth: 1,
      limit: 100,
      sort: 'sortOrder',
      locale: locale as 'en' | 'es',
      where: {
        isActive: { equals: true },
      },
    });

    return (result.docs ?? []).map((doc) => ({
      id: String(doc.id),
      slug: doc.slug,
      name: doc.name,
      description: doc.description ?? undefined,
    }));
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return [];
  }
}
