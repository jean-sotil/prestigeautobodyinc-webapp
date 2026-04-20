'use client';

import {
  QueryClientProvider,
  HydrationBoundary,
  type DehydratedState,
} from '@tanstack/react-query';
import { getQueryClient } from '@/lib/queries/queryClient';
import { useState } from 'react';

// ============================================================================
// Types
// ============================================================================

interface QueryProviderProps {
  children: React.ReactNode;
  dehydratedState?: DehydratedState;
}

// ============================================================================
// Query Provider Component
// ============================================================================

export function QueryProvider({
  children,
  dehydratedState,
}: QueryProviderProps) {
  // Use useState to ensure we only create the client once per session
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
    </QueryClientProvider>
  );
}

// ============================================================================
// Re-export HydrationBoundary for RSC usage
// ============================================================================

export { HydrationBoundary, type DehydratedState } from '@tanstack/react-query';
