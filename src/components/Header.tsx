'use client';

import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ButtonLink } from '@/components/ui/Button';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileDrawer from '@/components/MobileDrawer';
import Breadcrumbs from '@/components/Breadcrumbs';

interface NavItem {
  href: string;
  label: string;
}

export default function Header() {
  const t = useTranslations('nav');
  const c = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();

  // Main navigation items matching Figma design
  const navItems: NavItem[] = [
    { href: '/collision-repair', label: t('collisionRepair') },
    { href: '/about', label: 'Auto Body Services' },
    { href: '/auto-painting', label: t('autoPainting') },
    { href: '/insurance-claims', label: t('insuranceClaims') },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
  ];

  const isHomePage = pathname === `/${locale}` || pathname === '/';

  return (
    <>
      {/* Skip to content link - first focusable element */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-white dark:bg-gray-900 text-red-600 px-4 py-2 rounded-md font-medium shadow-lg border-2 border-red-600"
      >
        Skip to content
      </a>

      {/* Top Utility Bar */}
      <div className="bg-[#121212] text-[#a6a6a6] text-xs px-16 py-2 hidden md:flex items-center justify-between">
        <span>928 Philadelphia Ave, Silver Spring, MD 20910</span>
        <span>Mon-Fri: 8AM-6PM &nbsp;|&nbsp; Sat: 8AM-12PM</span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="hover:opacity-80 transition-opacity"
                aria-label="Prestige Auto Body Inc. - Home"
              >
                <div className="flex flex-col leading-tight">
                  <span className="font-black text-[22px] text-[#2d2d2d] dark:text-white tracking-wide">
                    PRESTIGE
                  </span>
                  <span className="font-bold text-[9px] text-[#c62828] tracking-widest">
                    AUTO BODY, INC
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center gap-8"
              aria-label="Main navigation"
            >
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname === `/${locale}${item.href}` ||
                  (item.href !== '/' &&
                    pathname.startsWith(`/${locale}${item.href}`));

                return (
                  <Link
                    key={item.href}
                    href={item.href as '/'}
                    className={`py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-[#c62828]'
                        : 'text-[#2d2d2d] hover:text-[#c62828] dark:text-gray-300 dark:hover:text-white'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              {/* Phone number - visible on desktop */}
              <div className="hidden lg:flex flex-col leading-tight">
                <a
                  href="tel:3015788779"
                  className="font-bold text-[15px] text-[#2d2d2d] dark:text-white hover:text-[#c62828] transition-colors"
                  aria-label="Call (301) 578-8779"
                >
                  (301) 578-8779
                </a>
                <span className="text-[11px] text-[#555] dark:text-gray-400">
                  Call for Free Estimate
                </span>
              </div>

              {/* Get a Quote CTA - visible on desktop */}
              <div className="hidden lg:block">
                <ButtonLink href="/contact" variant="primary" size="sm">
                  {c('getQuote')}
                </ButtonLink>
              </div>

              {/* Language Toggle - visible on desktop */}
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>

              {/* Mobile Menu Button */}
              <MobileDrawer />
            </div>
          </div>
        </div>

        {/* Breadcrumbs - only on interior pages */}
        {!isHomePage && (
          <div className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Breadcrumbs />
            </div>
          </div>
        )}
      </header>
    </>
  );
}
