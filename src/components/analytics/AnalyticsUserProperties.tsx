'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { setUserProperties } from '@/lib/analytics';
import { onConsentChange } from '@/lib/consent';
import type { UserProperties } from '@/lib/analytics-events';

function readTheme(): 'light' | 'dark' {
  if (document.documentElement.classList.contains('dark')) return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export default function AnalyticsUserProperties() {
  const locale = useLocale();

  useEffect(() => {
    const apply = () => {
      const props: UserProperties = {
        theme: readTheme(),
        locale: locale === 'es' ? 'es' : 'en',
      };
      setUserProperties(props);
    };

    apply();

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', apply);
    const offConsent = onConsentChange(apply);

    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      mq.removeEventListener('change', apply);
      offConsent();
      observer.disconnect();
    };
  }, [locale]);

  return null;
}
