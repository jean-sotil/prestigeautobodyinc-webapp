'use client';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { staleTimes } from './queryClient';
import type { BlogPost, BlogPostsResponse, BlogPostsParams } from './types';

// ============================================================================
// Types
// ============================================================================

export interface UseBlogPostsOptions extends BlogPostsParams {
  enabled?: boolean;
}

export interface UseBlogPostsReturn {
  posts: BlogPost[];
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetching: boolean;
}

export interface UseInfiniteBlogPostsReturn {
  posts: BlogPost[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

// ============================================================================
// Fetch Function
// ============================================================================

async function fetchBlogPosts({
  locale,
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
  category,
}: BlogPostsParams): Promise<BlogPostsResponse> {
  const params = new URLSearchParams({
    locale,
    depth: '2', // Include relationships (author, categories, featuredImage)
    page: page.toString(),
    limit: limit.toString(),
    sort: '-publishedAt', // Newest first
  });

  // Payload CMS where clause for status
  params.append('where[status][equals]', 'published');

  // Category filter using Payload where clause
  if (category) {
    params.append('where[categories][in]', category);
  }

  const response = await fetch(`/api/blog-posts?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to fetch blog posts: ${response.status}`,
    );
  }

  return response.json();
}

// ============================================================================
// Hook: Paginated Blog Posts
// ============================================================================

export function useBlogPosts({
  locale,
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
  category,
  enabled = true,
}: UseBlogPostsOptions): UseBlogPostsReturn {
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: queryKeys.blogPosts.list(locale, page, limit),
    queryFn: () => fetchBlogPosts({ locale, page, limit, category }),
    staleTime: staleTimes.blogPosts,
    gcTime: staleTimes.blogPosts * 3, // Keep blog posts cached longer
    enabled,
  });

  return {
    posts: data?.docs ?? [],
    totalPages: data?.totalPages ?? 0,
    currentPage: data?.page ?? page,
    hasNextPage: data?.hasNextPage ?? false,
    hasPrevPage: data?.hasPrevPage ?? false,
    isLoading,
    isError,
    error,
    isFetching,
  };
}

// ============================================================================
// Hook: Infinite Scroll Blog Posts
// ============================================================================

export function useInfiniteBlogPosts({
  locale,
  limit = DEFAULT_LIMIT,
  category,
  enabled = true,
}: Omit<UseBlogPostsOptions, 'page'>): UseInfiniteBlogPostsReturn {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: [...queryKeys.blogPosts.list(locale, 0, limit), 'infinite'],
    queryFn: ({ pageParam = 1 }) =>
      fetchBlogPosts({ locale, page: pageParam, limit, category }),
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNextPage) {
        return lastPage.nextPage;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: staleTimes.blogPosts,
    gcTime: staleTimes.blogPosts * 3,
    enabled,
  });

  // Flatten all pages into a single array
  const posts = data?.pages.flatMap((page) => page.docs) ?? [];

  return {
    posts,
    fetchNextPage,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  };
}

// ============================================================================
// Prefetch Helper for RSC
// ============================================================================

export async function prefetchBlogPosts(
  params: BlogPostsParams,
): Promise<BlogPostsResponse> {
  return fetchBlogPosts(params);
}

// ============================================================================
// Hook: Single Blog Post by Slug
// ============================================================================

export function useBlogPostBySlug(
  slug: string,
  locale: string,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.blogPosts.bySlug(slug, locale),
    queryFn: async () => {
      const params = new URLSearchParams({
        locale,
        depth: '2',
        'where[slug][equals]': slug,
        'where[status][equals]': 'published',
      });
      const response = await fetch(`/api/blog-posts?${params.toString()}`, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to fetch blog post: ${response.status}`,
        );
      }

      const data = await response.json();
      // Payload returns an array, return first result or throw if not found
      if (!data.docs || data.docs.length === 0) {
        throw new Error('Blog post not found');
      }
      return data.docs[0] as BlogPost;
    },
    staleTime: staleTimes.blogPosts,
    gcTime: staleTimes.blogPosts * 3,
    enabled: enabled && !!slug,
  });
}
