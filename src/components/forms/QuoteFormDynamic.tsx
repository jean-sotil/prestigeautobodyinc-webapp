'use client';

import dynamic from 'next/dynamic';
import { FormSkeleton } from '@/components/ui/Skeleton';

// Dynamic import of QuoteForm for code splitting
const QuoteFormComponent = dynamic(
  () => import('./QuoteForm').then((mod) => ({ default: mod.QuoteForm })),
  {
    loading: () => <FormSkeleton />,
    ssr: false, // Form requires client-side interactivity
  },
);

/**
 * QuoteFormDynamic - Client-side dynamic wrapper for QuoteForm
 *
 * Handles dynamic import with code splitting to keep the form out of
 * the initial bundle for better performance.
 */
export function QuoteFormDynamic() {
  return <QuoteFormComponent />;
}

export default QuoteFormDynamic;
