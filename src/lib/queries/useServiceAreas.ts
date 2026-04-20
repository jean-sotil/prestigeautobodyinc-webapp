'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { staleTimes } from './queryClient';
import type { ServiceArea, ServiceAreasResponse } from './types';

// ============================================================================
// Types
// ============================================================================

export interface UseServiceAreasOptions {
  locale: string;
  enabled?: boolean;
}

export interface UseServiceAreasReturn {
  areas: ServiceArea[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetching: boolean;
}

// ============================================================================
// Fetch Function
// ============================================================================

async function fetchServiceAreas(locale: string): Promise<ServiceArea[]> {
  const params = new URLSearchParams({
    locale,
    depth: '1',
    limit: '100', // Get all active areas
    sort: 'name',
  });

  // Payload CMS where clause for status
  params.append('where[status][equals]', 'active');

  const response = await fetch(`/api/service-areas?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to fetch service areas: ${response.status}`,
    );
  }

  const data: ServiceAreasResponse = await response.json();
  return data.docs;
}

// ============================================================================
// Hook: Service Areas List
// ============================================================================

export function useServiceAreas({
  locale,
  enabled = true,
}: UseServiceAreasOptions): UseServiceAreasReturn {
  const {
    data: areas = [],
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: queryKeys.serviceAreas.list(locale),
    queryFn: () => fetchServiceAreas(locale),
    staleTime: staleTimes.serviceAreas,
    gcTime: staleTimes.serviceAreas * 2,
    enabled,
  });

  return {
    areas,
    isLoading,
    isError,
    error,
    isFetching,
  };
}

// ============================================================================
// Hook: Single Service Area by Slug
// ============================================================================

export function useServiceAreaBySlug(
  slug: string,
  locale: string,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.serviceAreas.bySlug(slug, locale),
    queryFn: async () => {
      const params = new URLSearchParams({
        locale,
        depth: '1',
        'where[slug][equals]': slug,
        'where[status][equals]': 'active',
      });
      const response = await fetch(`/api/service-areas?${params.toString()}`, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to fetch service area: ${response.status}`,
        );
      }

      const data = await response.json();
      // Payload returns an array, return first result or throw if not found
      if (!data.docs || data.docs.length === 0) {
        throw new Error('Service area not found');
      }
      return data.docs[0] as ServiceArea;
    },
    staleTime: staleTimes.serviceAreas,
    gcTime: staleTimes.serviceAreas * 2,
    enabled: enabled && !!slug,
  });
}

// ============================================================================
// Hook: Service Area by ZIP Code
// ============================================================================

export function useServiceAreaByZip(zipCode: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.serviceAreas.byZip(zipCode),
    queryFn: async () => {
      const response = await fetch(`/api/service-areas/by-zip/${zipCode}`, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // No service area found for this ZIP
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to lookup ZIP code: ${response.status}`,
        );
      }

      return response.json() as Promise<ServiceArea | null>;
    },
    staleTime: staleTimes.serviceAreas,
    gcTime: staleTimes.serviceAreas * 2,
    enabled: enabled && !!zipCode,
  });
}

// ============================================================================
// Prefetch Helpers for RSC
// ============================================================================

export async function prefetchServiceAreas(
  locale: string,
): Promise<ServiceArea[]> {
  return fetchServiceAreas(locale);
}

export async function prefetchServiceAreaBySlug(
  slug: string,
  locale: string,
): Promise<ServiceArea> {
  const params = new URLSearchParams({
    locale,
    depth: '1',
    'where[slug][equals]': slug,
    'where[status][equals]': 'active',
  });
  const response = await fetch(`/api/service-areas?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to fetch service area: ${response.status}`,
    );
  }

  const data = await response.json();
  if (!data.docs || data.docs.length === 0) {
    throw new Error('Service area not found');
  }
  return data.docs[0];
}
