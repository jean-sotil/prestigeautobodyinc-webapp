'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/Skeleton';
import type { ReactNode } from 'react';

const QuoteForm = dynamic(
  () => import('@/components/quote-form/QuoteForm').then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div aria-busy="true" aria-label="Loading quote form">
        <Skeleton className="w-full h-[480px] rounded-2xl" />
      </div>
    ),
  },
);

export default function LazyQuoteForm({ sidebar }: { sidebar?: ReactNode }) {
  return <QuoteForm sidebar={sidebar} />;
}
