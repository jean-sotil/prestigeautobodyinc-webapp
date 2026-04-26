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

interface FetchRelatedPostsOptions {
  locale: string;
  excludeSlug: string;
  categorySlugs: string[];
  limit?: number;
}

/**
 * Posts in the same category as the current article, excluding it. Falls back
 * to the most recent posts in this locale if no category match is available so
 * the section never renders empty.
 */
export async function fetchRelatedPosts({
  locale,
  excludeSlug,
  categorySlugs,
  limit = 3,
}: FetchRelatedPostsOptions): Promise<BlogPost[]> {
  try {
    const payload = await getPayloadClient();

    const sameCategory =
      categorySlugs.length > 0
        ? await payload.find({
            collection: 'blog-posts',
            depth: 2,
            limit,
            sort: '-publishedAt',
            locale: locale as 'en' | 'es',
            where: {
              and: [
                { status: { equals: 'published' } },
                { 'categories.slug': { in: categorySlugs } },
                { slug: { not_equals: excludeSlug } },
              ],
            },
          })
        : { docs: [] as unknown[] };

    const related = sameCategory.docs as unknown as BlogPost[];

    // Top up with most-recent posts if the category alone didn't yield enough.
    if (related.length < limit) {
      const fillerNeeded = limit - related.length;
      const filler = await payload.find({
        collection: 'blog-posts',
        depth: 2,
        limit: fillerNeeded + 1, // +1 in case the excluded slug shows up
        sort: '-publishedAt',
        locale: locale as 'en' | 'es',
        where: {
          and: [
            { status: { equals: 'published' } },
            { slug: { not_equals: excludeSlug } },
          ],
        },
      });
      const existing = new Set(related.map((p) => p.id));
      for (const doc of filler.docs as unknown as BlogPost[]) {
        if (related.length >= limit) break;
        if (!existing.has(doc.id)) related.push(doc);
      }
    }

    return related.slice(0, limit);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

/**
 * Returns the published slug of a blog post in every supported locale.
 *
 * Payload stores `slug` as a localized field, so a single `find` with
 * `locale: 'all'` returns the slug as `{ en, es, … }`. We use this to power
 * the locale switcher and the page's `hreflang` alternates so cross-locale
 * navigation lands on the correct slug instead of 404'ing.
 */
export async function fetchPostLocalizedSlugs(
  postId: string,
): Promise<Record<string, string>> {
  try {
    const payload = await getPayloadClient();
    const doc = await payload.findByID({
      collection: 'blog-posts',
      id: postId,
      depth: 0,
      // 'all' tells Payload to return localized fields as { localeCode: value }
      locale: 'all',
    });

    const slug = (doc as { slug?: unknown }).slug;
    if (slug && typeof slug === 'object') {
      return Object.fromEntries(
        Object.entries(slug as Record<string, unknown>).filter(
          ([, v]) => typeof v === 'string' && v.length > 0,
        ) as Array<[string, string]>,
      );
    }
    return {};
  } catch (error) {
    console.error('Error fetching localized slugs:', error);
    return {};
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

/**
 * Count published posts per category slug. Single query, ~50 posts/yr expected,
 * so pulling up to 500 here is cheap and avoids N queries per category.
 */
export async function fetchCategoryPostCounts(
  locale: string,
): Promise<Record<string, number>> {
  try {
    const payload = await getPayloadClient();
    const posts = await payload.find({
      collection: 'blog-posts',
      depth: 1,
      limit: 500,
      pagination: false,
      locale: locale as 'en' | 'es',
      where: { status: { equals: 'published' } },
    });

    const counts: Record<string, number> = {};
    for (const post of posts.docs as Array<{
      categories?: Array<{ slug?: string } | string>;
    }>) {
      for (const cat of post.categories ?? []) {
        const slug = typeof cat === 'string' ? null : cat?.slug;
        if (slug) counts[slug] = (counts[slug] ?? 0) + 1;
      }
    }
    return counts;
  } catch (error) {
    console.error('Error fetching category counts:', error);
    return {};
  }
}

/**
 * Team members with at least one published post, ranked by post count.
 * Capped at 8 for the contributor strip.
 */
export async function fetchBlogContributors(locale: string): Promise<
  Array<{
    id: string;
    fullName: string;
    position: string;
    photoUrl?: string;
    photoAlt?: string;
    postCount: number;
  }>
> {
  try {
    const payload = await getPayloadClient();
    const posts = await payload.find({
      collection: 'blog-posts',
      depth: 0,
      limit: 500,
      pagination: false,
      locale: locale as 'en' | 'es',
      where: { status: { equals: 'published' } },
    });

    const counts = new Map<string, number>();
    for (const post of posts.docs as Array<{ author?: unknown }>) {
      const authorId =
        post.author != null ? String(post.author as string | number) : null;
      if (authorId) counts.set(authorId, (counts.get(authorId) ?? 0) + 1);
    }

    if (counts.size === 0) return [];

    const team = await payload.find({
      collection: 'team-members',
      depth: 1,
      limit: counts.size,
      pagination: false,
      locale: locale as 'en' | 'es',
      where: {
        and: [
          { id: { in: Array.from(counts.keys()) } },
          { status: { equals: 'active' } },
        ],
      },
    });

    return (
      team.docs as Array<{
        id: string | number;
        fullName: string;
        position: string;
        photo?: { url?: string; alt?: string };
      }>
    )
      .map((doc) => ({
        id: String(doc.id),
        fullName: doc.fullName,
        position: doc.position,
        photoUrl: doc.photo?.url,
        photoAlt: doc.photo?.alt,
        postCount: counts.get(String(doc.id)) ?? 0,
      }))
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 8);
  } catch (error) {
    console.error('Error fetching blog contributors:', error);
    return [];
  }
}
