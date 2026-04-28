'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('language');
  const otherLocale = locale === 'en' ? 'es' : 'en';

  const scrollToTop = () => {
    if (typeof window === 'undefined') return;

    const forceScroll = () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    forceScroll();
    requestAnimationFrame(forceScroll);
    [50, 100, 150, 200, 250, 300, 400, 500].forEach(delay =>
      setTimeout(forceScroll, delay)
    );
  };

  // For dynamic routes (e.g. blog/[slug]), read the hreflang alternate
  const [hreflangHref, setHreflangHref] = useState<string | null>(null);

  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>(
      `link[rel="alternate"][hreflang="${otherLocale}"]`,
    );
    let next: string | null = null;
    if (link?.href) {
      try {
        const url = new URL(link.href);
        next = `${url.pathname}${url.search}${url.hash}`;
      } catch {
        next = null;
      }
    }
    setHreflangHref(next);
  }, [otherLocale, pathname]);

  const ariaLabel = t('switchTo', {
    locale: t(otherLocale === 'en' ? 'english' : 'spanish').toLowerCase(),
  });
  const visibleLabel = locale === 'en' ? 'ES' : 'EN';

  const buttonStyles = "inline-flex shrink-0 items-center justify-center border bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 border-border bg-background hover:bg-muted hover:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem]";

  const handleSwitch = () => {
    scrollToTop();

    if (hreflangHref) {
      // Dynamic route: use the hreflang alternate URL
      window.location.href = hreflangHref;
    } else {
      // Static route: swap locale prefix in the current URL
      const currentPath = window.location.pathname;
      const newPath = currentPath.replace(`/${locale}`, `/${otherLocale}`);
      window.location.href = newPath;
    }
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={buttonStyles}
      onClick={handleSwitch}
    >
      {visibleLabel}
    </button>
  );
}
