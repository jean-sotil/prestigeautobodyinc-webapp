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

    const fire = () => trackPageView(path);

    // Defer until gtag('config') has been called — events sent before
    // config are dropped by GA because no stream is registered yet.
    if (window.__gaReady) {
      fire();
    } else {
      window.addEventListener('ga:ready', fire, { once: true });
    }

    const unsubConsent = onConsentChange((state) => {
      if (state !== 'granted') return;
      // GA script starts loading on consent grant; wait for it to configure.
      if (window.__gaReady) {
        fire();
      } else {
        window.addEventListener('ga:ready', fire, { once: true });
      }
    });

    return () => {
      window.removeEventListener('ga:ready', fire);
      unsubConsent();
    };
  }, [pathname, searchParams]);

  return null;
}
