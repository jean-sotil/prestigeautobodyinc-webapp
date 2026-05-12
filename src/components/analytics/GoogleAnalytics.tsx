'use client';

import { Suspense, useEffect, useSyncExternalStore } from 'react';
import { getConsent, onConsentChange } from '@/lib/consent';
import RouteChangeTracker from './RouteChangeTracker';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const subscribeConsent = (cb: () => void) => onConsentChange(cb);

export default function GoogleAnalytics() {
  const consent = useSyncExternalStore(
    subscribeConsent,
    () => getConsent(),
    () => undefined,
  );

  // Initialize stub and dataLayer on mount
  useEffect(() => {
    if (!GA_ID) return;
    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer!.push(args);
      };
    }
  }, []);

  // Load gtag.js script when consent is granted
  useEffect(() => {
    if (!GA_ID || consent !== 'granted') return;

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.async = true;

    script.onload = () => {
      if (window.gtag) {
        window.gtag('js', new Date());
        window.gtag('config', GA_ID, {
          send_page_view: false,
          anonymize_ip: true,
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      // Don't remove script on unmount to avoid breaking tracking
    };
  }, [consent]);

  if (!GA_ID) return null;

  return (
    <Suspense fallback={null}>
      <RouteChangeTracker />
    </Suspense>
  );
}
