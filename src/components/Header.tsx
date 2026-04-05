'use client';

import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ButtonLink } from '@/components/ui/Button';
import { PhoneIcon } from '@/components/ui/Icons';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeToggle from '@/components/ThemeToggle';
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

  // Main navigation items (6 items as specified)
  const navItems: NavItem[] = [
    { href: '/', label: t('home') },
    { href: '/collision-repair', label: t('collisionRepair') },
    { href: '/auto-painting', label: t('autoPainting') },
    { href: '/towing', label: t('towing') },
    { href: '/insurance-claims', label: t('insuranceClaims') },
    { href: '/about', label: t('about') },
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

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="text-xl font-bold text-red-600 hover:text-red-700 transition-colors"
                aria-label="Prestige Auto Body Inc. - Home"
              >
                <span className="flex items-center gap-2">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" />
                    <circle cx="6.5" cy="16.5" r="2.5" />
                    <circle cx="16.5" cy="16.5" r="2.5" />
                  </svg>
                  <span className="hidden sm:inline">Prestige Auto Body</span>
                  <span className="sm:hidden">PAB</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center space-x-1"
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
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Phone number - visible on tablet and up */}
              <a
                href="tel:3015788779"
                className="hidden md:flex items-center text-sm font-medium text-gray-700 hover:text-red-600 transition-colors min-h-[44px] px-2"
                aria-label="Call (301) 578-8779"
              >
                <PhoneIcon size={18} className="mr-1" ariaLabel="" />
                <span className="hidden lg:inline">(301) 578-8779</span>
              </a>

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

              {/* Theme Toggle - visible on desktop */}
              <div className="hidden md:block">
                <ThemeToggle />
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
