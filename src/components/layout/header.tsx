'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ButtonLink } from '@/components/ui/Button';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeToggle from '@/components/ThemeToggle';
import Breadcrumbs from '@/components/Breadcrumbs';
import UtilityBar from './UtilityBar';
import MobileNav from './MobileNav';
import { useNavItems, NavLink } from './NavLinks';

export default function Header() {
  const t = useTranslations('header');
  const c = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const navItems = useNavItems();
  const [scrolled, setScrolled] = useState(false);

  const isHomePage = pathname === `/${locale}` || pathname === '/';

  // Upgrade shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[60] bg-white dark:bg-[#121212] text-[#C62828] px-4 py-2 rounded-md font-medium shadow-lg border-2 border-[#C62828]"
      >
        {t('skipToContent')}
      </a>

      {/* Utility Bar */}
      <UtilityBar />

      {/* Main Header */}
      <header
        className={`sticky md:top-10 top-0 z-40 bg-white dark:bg-[#121212] border-b border-[#CCCCCC] dark:border-[#333333] transition-shadow duration-200 ${
          scrolled ? 'shadow-md' : 'shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="shrink-0">
              <Link
                href="/"
                className="hover:opacity-80 transition-opacity duration-200"
                aria-label="Prestige Auto Body Inc. - Home"
              >
                <Image
                  src="/logo.png"
                  alt="Prestige Auto Body Inc."
                  width={200}
                  height={80}
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center gap-8"
              aria-label={t('mainNavigation')}
            >
              {navItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Phone number - desktop only */}
              <div className="hidden lg:flex flex-col leading-tight">
                <a
                  href="tel:3015788779"
                  className="font-semibold text-sm font-sans text-[#2D2D2D] dark:text-[#E0E0E0] hover:text-[#C62828] dark:hover:text-[#C62828] transition-colors duration-200"
                  aria-label={`${c('callNow')} ${t('phone')}`}
                >
                  {t('phone')}
                </a>
                <span className="text-[11px] text-[#555555] dark:text-[#A0A0A0] font-sans">
                  {t('callForEstimate')}
                </span>
              </div>

              {/* Get a Quote CTA - desktop only */}
              <div className="hidden lg:block">
                <ButtonLink href="/contact" variant="primary" size="sm">
                  {c('getQuote')}
                </ButtonLink>
              </div>

              {/* Language Toggle - desktop only */}
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>

              {/* Dark mode toggle - desktop only */}
              <div className="hidden md:block">
                <ThemeToggle />
              </div>

              {/* Mobile Menu */}
              <MobileNav />
            </div>
          </div>
        </div>

        {/* Breadcrumbs - interior pages only */}
        {!isHomePage && (
          <div className="bg-[#F5F5F5] dark:bg-[#1E1E1E] border-t border-[#CCCCCC] dark:border-[#333333]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Breadcrumbs />
            </div>
          </div>
        )}
      </header>
    </>
  );
}
