'use client';

import dynamic from 'next/dynamic';
import { FormSkeleton } from '@/components/ui/Skeleton';

// Dynamic import of SimpleQuoteForm for code splitting
const SimpleQuoteFormComponent = dynamic(
  () =>
    import('./SimpleQuoteForm').then((mod) => ({
      default: mod.SimpleQuoteForm,
    })),
  {
    loading: () => <FormSkeleton />,
    ssr: false, // Form requires client-side interactivity
  },
);

/**
 * SimpleQuoteFormDynamic - Client-side dynamic wrapper for SimpleQuoteForm
 *
 * Handles dynamic import with code splitting to keep the form out of
 * the initial bundle for better performance.
 */
export function SimpleQuoteFormDynamic() {
  return <SimpleQuoteFormComponent />;
}

export default SimpleQuoteFormDynamic;
