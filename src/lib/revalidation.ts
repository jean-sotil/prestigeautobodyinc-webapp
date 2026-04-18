/**
 * ISR Revalidation utilities for blog posts
 * Triggers revalidation of blog pages when content changes
 */

interface RevalidationResult {
  success: boolean;
  revalidated?: boolean;
  message: string;
  paths?: string[];
}

/**
 * Revalidate a specific blog post page
 */
export async function revalidateBlogPost(
  slug: string,
  locale: string = 'en',
): Promise<RevalidationResult> {
  const revalidateSecret = process.env.REVALIDATE_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  if (!revalidateSecret) {
    console.warn('REVALIDATE_SECRET not configured, skipping revalidation');
    return {
      success: false,
      message: 'Revalidation not configured',
    };
  }

  try {
    const response = await fetch(`${siteUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: revalidateSecret,
        paths: [`/${locale}/blog/${slug}`, `/${locale}/blog`],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Revalidation failed');
    }

    return {
      success: true,
      revalidated: data.revalidated,
      message: data.message || 'Revalidation successful',
      paths: data.paths,
    };
  } catch (error) {
    console.error('Revalidation error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Revalidate blog listing pages (all locales)
 */
export async function revalidateBlogListing(): Promise<RevalidationResult> {
  const revalidateSecret = process.env.REVALIDATE_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  if (!revalidateSecret) {
    console.warn('REVALIDATE_SECRET not configured, skipping revalidation');
    return {
      success: false,
      message: 'Revalidation not configured',
    };
  }

  try {
    const paths = ['/en/blog', '/es/blog', '/en/blog/', '/es/blog/'];

    const response = await fetch(`${siteUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: revalidateSecret,
        paths,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Revalidation failed');
    }

    return {
      success: true,
      revalidated: data.revalidated,
      message: data.message || 'Blog listing revalidation successful',
      paths,
    };
  } catch (error) {
    console.error('Blog listing revalidation error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
