'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';

interface LanguageSwitcherProps {
  /**
   * Visual tone. `onDark` is for placement on a `bg-foreground` surface
   * (e.g. UtilityBar). `default` is for regular `bg-background` / `bg-card`
   * surfaces (mobile sheet, footer). Both tones flip correctly for dark mode.
   */
  tone?: 'default' | 'onDark';
}

function FlagUSA({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 16"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="24" height="16" fill="#B22234" />
      <g fill="#FFFFFF">
        <rect y="1.23" width="24" height="1.23" />
        <rect y="3.69" width="24" height="1.23" />
        <rect y="6.15" width="24" height="1.23" />
        <rect y="8.62" width="24" height="1.23" />
        <rect y="11.08" width="24" height="1.23" />
        <rect y="13.54" width="24" height="1.23" />
      </g>
      <rect width="10" height="8.62" fill="#3C3B6E" />
      <g fill="#FFFFFF">
        <circle cx="2" cy="1.7" r="0.5" />
        <circle cx="4" cy="1.7" r="0.5" />
        <circle cx="6" cy="1.7" r="0.5" />
        <circle cx="8" cy="1.7" r="0.5" />
        <circle cx="3" cy="3.3" r="0.5" />
        <circle cx="5" cy="3.3" r="0.5" />
        <circle cx="7" cy="3.3" r="0.5" />
        <circle cx="2" cy="4.9" r="0.5" />
        <circle cx="4" cy="4.9" r="0.5" />
        <circle cx="6" cy="4.9" r="0.5" />
        <circle cx="8" cy="4.9" r="0.5" />
        <circle cx="3" cy="6.5" r="0.5" />
        <circle cx="5" cy="6.5" r="0.5" />
        <circle cx="7" cy="6.5" r="0.5" />
      </g>
    </svg>
  );
}

function FlagMX({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 16"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="8" height="16" fill="#006847" />
      <rect x="8" width="8" height="16" fill="#FFFFFF" />
      <rect x="16" width="8" height="16" fill="#CE1126" />
      <g transform="translate(12 8)">
        <circle r="2" fill="none" stroke="#8B6F1A" strokeWidth="0.35" />
        <ellipse rx="0.7" ry="1.3" fill="#8B6F1A" />
      </g>
    </svg>
  );
}

export default function LanguageSwitcher({
  tone = 'default',
}: LanguageSwitcherProps = {}) {
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
    [50, 100, 150, 200, 250, 300, 400, 500].forEach((delay) =>
      setTimeout(forceScroll, delay),
    );
  };

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHreflangHref(next);
  }, [otherLocale, pathname]);

  const currentLocaleName = t(locale === 'en' ? 'english' : 'spanish');
  const otherLocaleName = t(otherLocale === 'en' ? 'english' : 'spanish');
  const ariaLabel = `${t('current', { locale: currentLocaleName })}. ${t('switchTo', { locale: otherLocaleName.toLowerCase() })}`;

  const handleSwitch = () => {
    scrollToTop();

    if (hreflangHref) {
      window.location.href = hreflangHref;
    } else {
      const currentPath = window.location.pathname;
      const newPath = currentPath.replace(`/${locale}`, `/${otherLocale}`);
      window.location.href = newPath;
    }
  };

  const isOnDark = tone === 'onDark';

  const containerClasses = isOnDark
    ? 'bg-background/10 ring-1 ring-inset ring-background/20 hover:bg-background/15 hover:ring-background/35'
    : 'bg-muted ring-1 ring-inset ring-border hover:ring-border/80';

  const cellBase =
    'inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[0.7rem] font-semibold uppercase leading-none tracking-wide transition-all duration-200';

  const activeCellClass = isOnDark
    ? 'bg-background text-foreground shadow-sm'
    : 'bg-foreground text-background shadow-sm';

  const inactiveCellClass = isOnDark
    ? 'text-background/65 group-hover:text-background/90'
    : 'text-muted-foreground group-hover:text-foreground';

  const flagBase =
    'block h-3.5 w-[21px] shrink-0 overflow-hidden rounded-[2px] ring-1 ring-inset ring-black/10';

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={handleSwitch}
      className={`group relative inline-flex shrink-0 items-center gap-0.5 rounded-full p-0.75 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${containerClasses}`}
    >
      <span
        aria-hidden="true"
        data-active={locale === 'en'}
        className={`${cellBase} ${
          locale === 'en' ? activeCellClass : inactiveCellClass
        }`}
      >
        <FlagUSA
          className={`${flagBase} transition-opacity duration-200 ${
            locale === 'en' ? 'opacity-100' : 'opacity-70'
          }`}
        />
        <span>EN</span>
      </span>
      <span
        aria-hidden="true"
        data-active={locale === 'es'}
        className={`${cellBase} ${
          locale === 'es' ? activeCellClass : inactiveCellClass
        }`}
      >
        <FlagMX
          className={`${flagBase} transition-opacity duration-200 ${
            locale === 'es' ? 'opacity-100' : 'opacity-70'
          }`}
        />
        <span>ES</span>
      </span>
    </button>
  );
}
