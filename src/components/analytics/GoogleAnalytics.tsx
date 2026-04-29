'use client';

import { Suspense, useEffect, useSyncExternalStore } from 'react';
import Script from 'next/script';
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
  const shouldLoad = consent === 'granted';

  useEffect(() => {
    if (!GA_ID) return;
    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer!.push(args);
      };
    }
  }, []);

  if (!GA_ID) return null;

  return (
    <>
      {shouldLoad && (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
          onLoad={() => {
            if (!window.gtag) return;
            window.gtag('js', new Date());
            window.gtag('config', GA_ID, {
              send_page_view: false,
              anonymize_ip: true,
            });
          }}
        />
      )}
      <Suspense fallback={null}>
        <RouteChangeTracker />
      </Suspense>
    </>
  );
}
