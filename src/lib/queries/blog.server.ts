/**
 * Server-side blog query utilities for React Server Components
 * These functions run on the server and fetch data directly from Payload CMS
 */

import type { BlogPost, BlogPostsResponse } from './types';

// Default pagination values
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

interface FetchBlogPostsOptions {
  locale: string;
  page?: number;
  limit?: number;
  category?: string;
}

/**
 * Server-side function to fetch blog posts
 * Uses Payload's local API for server components
 */
export async function fetchBlogPosts({
  locale,
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
  category,
}: FetchBlogPostsOptions): Promise<BlogPostsResponse> {
  try {
    // Use the Payload REST API
    const params = new URLSearchParams({
      depth: '2', // Include relationships (author, categories, featuredImage)
      page: page.toString(),
      limit: limit.toString(),
      sort: '-publishedAt', // Newest first
      locale,
    });

    // Add status filter
    params.append('where[status][equals]', 'published');

    // Add category filter if provided
    if (category) {
      params.append('where[categories][in]', category);
    }

    const apiUrl = process.env.PAYLOAD_API_URL || 'http://localhost:3000';
    const response = await fetch(
      `${apiUrl}/api/blog-posts?${params.toString()}`,
      {
        headers: {
          Accept: 'application/json',
        },
        // Cache for 60 seconds in production, no cache in dev
        next: { revalidate: process.env.NODE_ENV === 'production' ? 60 : 0 },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    // Return empty response on error
    return {
      docs: [],
      totalDocs: 0,
      totalPages: 0,
      page: 1,
      hasNextPage: false,
      hasPrevPage: false,
      nextPage: null,
      prevPage: null,
    };
  }
}

/**
 * Server-side function to fetch a single blog post by slug
 */
export async function fetchBlogPostBySlug(
  slug: string,
  locale: string,
): Promise<BlogPost | null> {
  try {
    const params = new URLSearchParams({
      depth: '2',
      'where[slug][equals]': slug,
      'where[status][equals]': 'published',
      locale,
    });

    const apiUrl = process.env.PAYLOAD_API_URL || 'http://localhost:3000';
    const response = await fetch(
      `${apiUrl}/api/blog-posts?${params.toString()}`,
      {
        headers: {
          Accept: 'application/json',
        },
        // Cache for 60 seconds in production
        next: { revalidate: process.env.NODE_ENV === 'production' ? 60 : 0 },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch blog post: ${response.status}`);
    }

    const data: BlogPostsResponse = await response.json();

    // Return first result or null if not found
    if (!data.docs || data.docs.length === 0) {
      return null;
    }

    return data.docs[0];
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return null;
  }
}

/**
 * Server-side function to fetch all blog categories
 */
export async function fetchBlogCategories(locale: string): Promise<
  Array<{
    id: string;
    slug: string;
    name: string;
    description?: string;
  }>
> {
  try {
    const params = new URLSearchParams({
      depth: '1',
      'where[isActive][equals]': 'true',
      sort: 'sortOrder',
      locale,
    });

    const apiUrl = process.env.PAYLOAD_API_URL || 'http://localhost:3000';
    const response = await fetch(
      `${apiUrl}/api/blog-categories?${params.toString()}`,
      {
        headers: {
          Accept: 'application/json',
        },
        next: { revalidate: process.env.NODE_ENV === 'production' ? 300 : 0 },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    const data = await response.json();
    return data.docs || [];
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return [];
  }
}
