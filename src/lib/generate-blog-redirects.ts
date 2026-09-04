/**
 * Generate 301 redirects for blog posts with incorrect locale/slug combinations.
 *
 * Example: If a post has slug "insurance-deductible" in English and
 * "deductible-seguro" in Spanish, this generates:
 * - /es/blog/insurance-deductible → /es/blog/deductible-seguro
 * - /en/blog/deductible-seguro → /en/blog/insurance-deductible
 */

import type { Redirect } from 'next';

interface BlogPostSlugs {
  id: string;
  en: string;
  es: string;
}

async function fetchBlogPostSlugs(): Promise<BlogPostSlugs[]> {
  try {
    const { getPayload } = await import('payload');
    const config = await import('@payload-config');
    const payload = await getPayload({ config: config.default });

    // Fetch all published blog posts
    const posts = await payload.find({
      collection: 'blog-posts',
      depth: 0,
      limit: 1000,
      pagination: false,
      locale: 'en', // Start with English
      where: {
        publishStatus: { equals: 'published' },
      },
    });

    const slugs: BlogPostSlugs[] = [];

    for (const post of posts.docs as Array<{
      id: string;
      slug?: string;
    }>) {
      if (!post.slug) continue;

      // Fetch all locales for this post
      const allLocales = await payload.findByID({
        collection: 'blog-posts',
        id: post.id,
        depth: 0,
        locale: 'all',
      });

      const postSlugs = (allLocales as { slug?: unknown }).slug;
      if (!postSlugs || typeof postSlugs !== 'object') continue;

      const enSlug = (postSlugs as Record<string, unknown>)['en'];
      const esSlug = (postSlugs as Record<string, unknown>)['es'];

      if (typeof enSlug === 'string' && typeof esSlug === 'string') {
        slugs.push({
          id: post.id,
          en: enSlug,
          es: esSlug,
        });
      }
    }

    return slugs;
  } catch (error) {
    console.error('Error fetching blog post slugs for redirects:', error);
    return [];
  }
}

export async function generateBlogRedirects(): Promise<Redirect[]> {
  const slugs = await fetchBlogPostSlugs();
  const redirects: Redirect[] = [];

  for (const post of slugs) {
    // Skip if the slugs are identical (no redirect needed)
    if (post.en === post.es) continue;

    // Redirect: Spanish slug under /en/ → /en/blog/:en-slug
    // Example: /en/blog/deductible-seguro → /en/blog/insurance-deductible
    redirects.push({
      source: `/en/blog/${post.es}`,
      destination: `/en/blog/${post.en}`,
      permanent: true,
    });

    // Redirect: English slug under /es/ → /es/blog/:es-slug
    // Example: /es/blog/insurance-deductible → /es/blog/deductible-seguro
    redirects.push({
      source: `/es/blog/${post.en}`,
      destination: `/es/blog/${post.es}`,
      permanent: true,
    });

    // Redirect: English slug without locale → /en/blog/:en-slug (already handled by catch-all)
    // But include for completeness
    redirects.push({
      source: `/blog/${post.en}`,
      destination: `/en/blog/${post.en}`,
      permanent: true,
    });

    // Redirect: Spanish slug without locale → /es/blog/:es-slug
    redirects.push({
      source: `/blog/${post.es}`,
      destination: `/es/blog/${post.es}`,
      permanent: true,
    });
  }

  return redirects;
}
