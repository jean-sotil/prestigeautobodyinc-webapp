'use client';

import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ButtonLink } from '@/components/ui/Button';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Caption } from '@/components/ui/Typography';
import UtilityBar from './UtilityBar';
import MobileNav from './MobileNav';
import { useNavItems, NavLink } from './NavLinks';
import Image from 'next/image';

export default function Header() {
  const t = useTranslations('header');
  const c = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const navItems = useNavItems();

  const isHomePage = pathname === `/${locale}` || pathname === '/';

  return (
    <>
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[60] bg-background text-primary px-4 py-2 rounded-md font-medium shadow-lg border-2 border-primary"
      >
        {t('skipToContent')}
      </a>

      {/* Row 1: Utility Bar */}
      <UtilityBar />

      {/* Row 2: Main Header */}
      <header className="sticky md:top-10 top-0 z-40 h-16 bg-background/80 backdrop-blur-md shadow-sm rounded-b-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <div className="shrink-0">
              <Link
                href="/"
                className="hover:opacity-80 transition-opacity duration-200"
                aria-label="Prestige Auto Body Inc. - Home"
              >
                <Image
                  src="/logo.png"
                  alt="Prestige Auto Body Inc. Logo"
                  width={150}
                  height={40}
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center gap-6"
              aria-label={t('mainNavigation')}
            >
              {navItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Phone number - desktop only */}
              <div className="hidden lg:flex flex-col items-end leading-tight">
                <a
                  href="tel:3015788779"
                  className="font-bold text-sm text-foreground hover:text-primary transition-colors duration-200"
                  aria-label={`${c('callNow')} ${t('phone')}`}
                >
                  {t('phone')}
                </a>
                <Caption color="muted">{t('callForEstimate')}</Caption>
              </div>

              {/* Get a Quote CTA - desktop only */}
              <div className="hidden lg:block">
                <ButtonLink
                  href="/contact"
                  variant="primary"
                  size="sm"
                  className="rounded-full shadow-lg"
                >
                  {c('getQuote')}
                </ButtonLink>
              </div>

              {/* Language Toggle - desktop only */}
              <div className="hidden lg:block">
                <LanguageSwitcher />
              </div>

              {/* Mobile Menu */}
              <MobileNav />
            </div>
          </div>
        </div>

        {/* Breadcrumbs - interior pages only */}
        {!isHomePage && (
          <div className="bg-muted border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Breadcrumbs />
            </div>
          </div>
        )}
      </header>
    </>
  );
}
