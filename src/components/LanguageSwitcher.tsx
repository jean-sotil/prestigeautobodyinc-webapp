'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import NextLink from 'next/link';
import { Link, usePathname } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('language');
  const otherLocale = locale === 'en' ? 'es' : 'en';

  // For routes with dynamic localized segments (e.g. /[locale]/blog/[slug]),
  // next-intl can't resolve the cross-locale URL from the static pathname map.
  // The page emits <link rel="alternate" hreflang="…"> via Next metadata; we
  // read that to navigate to the correct localized slug instead of 404'ing.
  const [hreflangHref, setHreflangHref] = useState<string | null>(null);

  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>(
      `link[rel="alternate"][hreflang="${otherLocale}"]`,
    );
    let next: string | null = null;
    if (link?.href) {
      try {
        // Strip the origin so we can route via Next's client-side navigation.
        const url = new URL(link.href);
        next = `${url.pathname}${url.search}${url.hash}`;
      } catch {
        next = null;
      }
    }
    // Reading the document head after mount is the entire point of this effect;
    // the rule is overzealous here. Mirrors the pattern in ThemeToggle / HeroCarousel.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHreflangHref(next);
  }, [otherLocale, pathname]);

  const ariaLabel = t('switchTo', {
    locale: t(otherLocale === 'en' ? 'english' : 'spanish').toLowerCase(),
  });
  const visibleLabel = locale === 'en' ? 'ES' : 'EN';

  // Override path: respect the page-supplied alternate.
  if (hreflangHref) {
    return (
      <Button
        variant="outline"
        size="sm"
        render={<NextLink href={hreflangHref} aria-label={ariaLabel} />}
      >
        {visibleLabel}
      </Button>
    );
  }

  // Default path: next-intl's static pathname remap.
  return (
    <Button
      variant="outline"
      size="sm"
      render={
        <Link href={pathname} locale={otherLocale} aria-label={ariaLabel} />
      }
    >
      {visibleLabel}
    </Button>
  );
}
