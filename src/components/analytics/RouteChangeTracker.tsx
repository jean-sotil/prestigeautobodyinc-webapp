'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';
import { onConsentChange } from '@/lib/consent';

export default function RouteChangeTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const query = searchParams?.toString();
    const path = query ? `${pathname}?${query}` : pathname;

    trackPageView(path);

    return onConsentChange((state) => {
      if (state === 'granted') trackPageView(path);
    });
  }, [pathname, searchParams]);

  return null;
}
