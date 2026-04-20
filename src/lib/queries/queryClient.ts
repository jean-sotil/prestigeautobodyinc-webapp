/**
 * TanStack Query Client Configuration
 * Optimized for Next.js App Router with RSC support
 */

import {
  QueryClient,
  defaultShouldDehydrateQuery,
  type Query,
} from '@tanstack/react-query';

// ============================================================================
// Query Client Configuration
// ============================================================================

export const queryClientConfig = {
  defaultOptions: {
    queries: {
      // Default stale time - data considered fresh for 1 minute
      staleTime: 60 * 1000,
      // Garbage collection time - unused data kept for 5 minutes
      gcTime: 5 * 60 * 1000,
      // Retry failed requests 2 times
      retry: 2,
      // Retry delay increases exponentially
      retryDelay: (attemptIndex: number) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus (disabled for performance)
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
      // Don't refetch on mount if data exists
      refetchOnMount: false,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      retryDelay: 1000,
    },
  },
  dehydrate: {
    // Include pending queries in dehydration for SSR
    shouldDehydrateQuery: (query: Query) =>
      defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
  },
};

// ============================================================================
// Stale Time Configurations (per data type)
// ============================================================================

export const staleTimes = {
  // Testimonials change infrequently - 5 minutes
  testimonials: 5 * 60 * 1000,
  // Blog posts may update more frequently - 1 minute
  blogPosts: 60 * 1000,
  // Service areas rarely change - 10 minutes
  serviceAreas: 10 * 60 * 1000,
  // Quote submission - no caching for mutations
  quoteSubmit: 0,
  // Default fallback
  default: 60 * 1000,
};

// ============================================================================
// Query Client Factory
// ============================================================================

let browserQueryClient: QueryClient | undefined = undefined;

export function makeQueryClient() {
  return new QueryClient(queryClientConfig);
}

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

// ============================================================================
// Export configured QueryClient for direct use
// ============================================================================

export const queryClient = getQueryClient();
