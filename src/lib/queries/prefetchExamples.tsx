/**
 * Example React Server Component (RSC) with TanStack Query Prefetching
 *
 * This demonstrates the zero-waterfall pattern using HydrationBoundary.
 * Data is fetched on the server and dehydrated, then hydrated on the client
 * without additional network requests.
 */

import { dehydrate } from '@tanstack/react-query';
import { makeQueryClient } from '@/lib/queries/queryClient';
import { queryKeys } from '@/lib/queries/queryKeys';
import {
  prefetchTestimonials,
  prefetchBlogPosts,
  prefetchServiceAreas,
} from '@/lib/queries';
import { QueryProvider } from '@/providers/QueryProvider';

// ============================================================================
// Example 1: Testimonials Page with Prefetching
// ============================================================================

interface TestimonialsPagePrefetchProps {
  locale: string;
  featured?: boolean;
  children: React.ReactNode;
}

/**
 * Server Component wrapper that prefetches testimonials data
 * and provides it via HydrationBoundary for zero-waterfall loading
 */
export async function TestimonialsPagePrefetch({
  locale,
  featured,
  children,
}: TestimonialsPagePrefetchProps) {
  // Create a fresh query client for this server request
  const queryClient = makeQueryClient();

  // Prefetch testimonials data on the server
  await queryClient.prefetchQuery({
    queryKey: queryKeys.testimonials.list(locale, featured),
    queryFn: () => prefetchTestimonials(locale, featured),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Dehydrate the cache to pass to the client
  const dehydratedState = dehydrate(queryClient);

  return (
    <QueryProvider dehydratedState={dehydratedState}>{children}</QueryProvider>
  );
}

// ============================================================================
// Example 2: Blog Listing Page with Prefetching
// ============================================================================

interface BlogPagePrefetchProps {
  locale: string;
  page?: number;
  limit?: number;
  category?: string;
  children: React.ReactNode;
}

/**
 * Server Component wrapper that prefetches blog posts
 * Supports pagination and category filtering
 */
export async function BlogPagePrefetch({
  locale,
  page = 1,
  limit = 10,
  category,
  children,
}: BlogPagePrefetchProps) {
  const queryClient = makeQueryClient();

  // Prefetch blog posts data on the server
  await queryClient.prefetchQuery({
    queryKey: queryKeys.blogPosts.list(locale, page, limit),
    queryFn: () =>
      prefetchBlogPosts({
        locale,
        page,
        limit,
        category,
      }),
    staleTime: 60 * 1000, // 1 minute
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <QueryProvider dehydratedState={dehydratedState}>{children}</QueryProvider>
  );
}

// ============================================================================
// Example 3: Service Areas Page with Prefetching
// ============================================================================

interface ServiceAreasPagePrefetchProps {
  locale: string;
  children: React.ReactNode;
}

/**
 * Server Component wrapper that prefetches service areas
 */
export async function ServiceAreasPagePrefetch({
  locale,
  children,
}: ServiceAreasPagePrefetchProps) {
  const queryClient = makeQueryClient();

  // Prefetch service areas data on the server
  await queryClient.prefetchQuery({
    queryKey: queryKeys.serviceAreas.list(locale),
    queryFn: () => prefetchServiceAreas(locale),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <QueryProvider dehydratedState={dehydratedState}>{children}</QueryProvider>
  );
}

// ============================================================================
// Example 4: Combined Prefetching for Dashboard/Homepage
// ============================================================================

interface DashboardPrefetchProps {
  locale: string;
  children: React.ReactNode;
}

/**
 * Server Component that prefetches multiple data sources
 * for a dashboard or homepage with various data sections
 */
export async function DashboardPrefetch({
  locale,
  children,
}: DashboardPrefetchProps) {
  const queryClient = makeQueryClient();

  // Parallel prefetching for multiple data sources
  await Promise.all([
    // Featured testimonials for hero section
    queryClient.prefetchQuery({
      queryKey: queryKeys.testimonials.list(locale, true),
      queryFn: () => prefetchTestimonials(locale, true),
      staleTime: 5 * 60 * 1000,
    }),

    // Latest blog posts
    queryClient.prefetchQuery({
      queryKey: queryKeys.blogPosts.list(locale, 1, 6),
      queryFn: () =>
        prefetchBlogPosts({
          locale,
          page: 1,
          limit: 6,
        }),
      staleTime: 60 * 1000,
    }),

    // Service areas for locations widget
    queryClient.prefetchQuery({
      queryKey: queryKeys.serviceAreas.list(locale),
      queryFn: () => prefetchServiceAreas(locale),
      staleTime: 10 * 60 * 1000,
    }),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <QueryProvider dehydratedState={dehydratedState}>{children}</QueryProvider>
  );
}
