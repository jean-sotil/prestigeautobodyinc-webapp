'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { MenuIcon, CloseIcon, PhoneIcon } from '@/components/ui/Icons';
import { ButtonLink } from '@/components/ui/Button';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

interface NavItem {
  href: string;
  label: string;
}

export default function MobileDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();

  // Navigation items
  const navItems: NavItem[] = [
    { href: '/', label: t('home') },
    { href: '/collision-repair', label: t('collisionRepair') },
    { href: '/auto-painting', label: t('autoPainting') },
    { href: '/towing', label: t('towing') },
    { href: '/insurance-claims', label: t('insuranceClaims') },
    { href: '/about', label: t('about') },
  ];

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Handle focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = drawerRef.current?.querySelectorAll(
        'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleTabKey);

    // Focus first element when opening
    setTimeout(() => {
      firstFocusableRef.current?.focus();
    }, 100);

    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        ref={firstFocusableRef}
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors min-w-[44px] min-h-[44px]"
        aria-expanded={isOpen}
        aria-controls="mobile-drawer"
        aria-label="Open menu"
      >
        <MenuIcon size={24} />
      </button>

      {/* Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        id="mobile-drawer"
        className={`fixed top-0 right-0 h-full w-[80%] max-w-[320px] bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Menu
            </span>
            <button
              ref={lastFocusableRef}
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors min-w-[44px] min-h-[44px]"
              aria-label="Close menu"
            >
              <CloseIcon size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav
            className="flex-1 overflow-y-auto py-4"
            aria-label="Mobile navigation"
          >
            <ul className="space-y-1 px-4">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname === `/${locale}${item.href}`;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href as '/'}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-md text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Click-to-Call */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <ButtonLink
              href="tel:3015788779"
              variant="primary"
              size="md"
              className="w-full"
              aria-label="Call (301) 578-8779"
            >
              <PhoneIcon size={20} className="mr-2" ariaLabel="" />
              <span>(301) 578-8779</span>
            </ButtonLink>
          </div>

          {/* Toggles */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
