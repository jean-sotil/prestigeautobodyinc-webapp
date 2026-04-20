'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { staleTimes } from './queryClient';
import type { Testimonial, TestimonialsResponse } from './types';

// ============================================================================
// Types
// ============================================================================

export interface UseTestimonialsOptions {
  locale: string;
  featured?: boolean;
  enabled?: boolean;
}

export interface UseTestimonialsReturn {
  testimonials: Testimonial[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetching: boolean;
}

// ============================================================================
// Fetch Function
// ============================================================================

async function fetchTestimonials(
  locale: string,
  featured?: boolean,
): Promise<Testimonial[]> {
  // Build query params
  const params = new URLSearchParams({
    locale,
    depth: '1', // Include relationships (serviceType, customerPhoto)
    limit: '50',
    sort: 'order',
  });

  // Payload CMS where clause for status
  params.append('where[status][equals]', 'published');

  // Featured filter using Payload where clause
  if (featured !== undefined) {
    params.append('where[featured][equals]', featured.toString());
  }

  const response = await fetch(`/api/testimonials?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to fetch testimonials: ${response.status}`,
    );
  }

  const data: TestimonialsResponse = await response.json();
  return data.docs;
}

// ============================================================================
// Hook
// ============================================================================

export function useTestimonials({
  locale,
  featured,
  enabled = true,
}: UseTestimonialsOptions): UseTestimonialsReturn {
  const {
    data: testimonials = [],
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: queryKeys.testimonials.list(locale, featured),
    queryFn: () => fetchTestimonials(locale, featured),
    staleTime: staleTimes.testimonials,
    gcTime: staleTimes.testimonials * 2, // Keep in cache longer
    enabled,
  });

  return {
    testimonials,
    isLoading,
    isError,
    error,
    isFetching,
  };
}

// ============================================================================
// Prefetch Helper for RSC
// ============================================================================

export async function prefetchTestimonials(
  locale: string,
  featured?: boolean,
): Promise<Testimonial[]> {
  return fetchTestimonials(locale, featured);
}
