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

  // Load gtag.js script when consent is granted.
  // The injection is deferred to browser idle time so fetching/parsing gtag.js
  // (a ~79ms long task) stays off the critical path and does not inflate TBT.
  // Consent gating and the gtag('config') -> 'ga:ready' ordering are unchanged.
  useEffect(() => {
    if (!GA_ID || consent !== 'granted') return;
    if (window.__gaReady) return;

    let cancelled = false;

    const inject = () => {
      if (cancelled || window.__gaReady) return;
      if (document.querySelector(`script[data-ga-id="${GA_ID}"]`)) return;

      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      script.async = true;
      script.dataset.gaId = GA_ID;

      script.onload = () => {
        if (window.gtag) {
          window.gtag('js', new Date());
          window.gtag('config', GA_ID, {
            send_page_view: false,
            anonymize_ip: true,
          });
          window.__gaReady = true;
          window.dispatchEvent(new Event('ga:ready'));
        }
      };

      document.head.appendChild(script);
    };

    // requestIdleCallback is not available in every browser (e.g. older
    // Safari); fall back to a near-immediate timeout there.
    const hasIdleCallback = typeof window.requestIdleCallback === 'function';
    const handle = hasIdleCallback
      ? window.requestIdleCallback(inject, { timeout: 2000 })
      : window.setTimeout(inject, 1);

    return () => {
      // Cancel only the pending idle/timeout callback. Never remove an
      // already-injected script, which would break tracking.
      cancelled = true;
      if (hasIdleCallback) {
        window.cancelIdleCallback(handle as number);
      } else {
        window.clearTimeout(handle as number);
      }
    };
  }, [consent]);

  if (!GA_ID) return null;

  return (
    <Suspense fallback={null}>
      <RouteChangeTracker />
    </Suspense>
  );
}
