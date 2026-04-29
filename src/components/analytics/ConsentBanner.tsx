'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { getConsent, onConsentChange, setConsent } from '@/lib/consent';

const GA_ENABLED = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);

const subscribeConsent = (cb: () => void) => onConsentChange(cb);
const subscribeNoop = () => () => {};

export default function ConsentBanner() {
  const t = useTranslations('consentBanner');
  const consent = useSyncExternalStore(
    subscribeConsent,
    () => getConsent(),
    () => undefined,
  );
  const isClient = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

  const visible = GA_ENABLED && isClient && consent === undefined;

  useEffect(() => {
    if (!visible) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setConsent('denied');
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label={t('label')}
      className="fixed inset-x-3 bottom-3 z-[70] sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-md rounded-2xl border border-border bg-card text-card-foreground shadow-2xl p-5"
    >
      <h2
        id="consent-banner-heading"
        className="font-semibold text-base text-foreground mb-1.5"
      >
        {t('heading')}
      </h2>
      <p
        id="consent-banner-body"
        className="text-sm text-muted-foreground leading-relaxed"
      >
        {t('body')}{' '}
        <Link
          href="/privacy-policy"
          className="underline underline-offset-2 text-primary hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          {t('learnMore')}
        </Link>
      </p>
      <div className="mt-4 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
        <button
          type="button"
          onClick={() => setConsent('denied')}
          className="inline-flex items-center justify-center min-h-[40px] px-4 rounded-md border border-border bg-background text-foreground text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t('reject')}
        </button>
        <button
          type="button"
          onClick={() => setConsent('granted')}
          autoFocus
          className="inline-flex items-center justify-center min-h-[40px] px-4 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {t('accept')}
        </button>
      </div>
    </div>
  );
}
