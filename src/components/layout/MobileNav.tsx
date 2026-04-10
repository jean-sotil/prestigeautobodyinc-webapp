'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { MenuIcon, CloseIcon, PhoneIcon } from '@/components/ui/Icons';
import { ButtonLink } from '@/components/ui/Button';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeToggle from '@/components/ThemeToggle';
import { useNavItems, useIsActiveLink } from './NavLinks';

function MobileNavLink({
  href,
  label,
  onClose,
}: {
  href: string;
  label: string;
  onClose: () => void;
}) {
  const isActive = useIsActiveLink(href);

  return (
    <li>
      <Link
        href={href as '/'}
        onClick={onClose}
        className={`block px-4 py-3 rounded-md text-base font-medium font-sans transition-colors duration-200 ${
          isActive
            ? 'bg-red-50 text-[#C62828] dark:bg-red-950 dark:text-red-400'
            : 'text-[#2D2D2D] hover:bg-gray-100 hover:text-[#C62828] dark:text-[#E0E0E0] dark:hover:bg-gray-800 dark:hover:text-white'
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        {label}
      </Link>
    </li>
  );
}

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations('header');
  const c = useTranslations('common');
  const navItems = useNavItems();

  const close = () => {
    setIsOpen(false);
    // Return focus to trigger button
    setTimeout(() => triggerRef.current?.focus(), 100);
  };

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Focus trap
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

    // Focus close button when opening
    const closeBtn = drawerRef.current?.querySelector('button') as HTMLElement;
    setTimeout(() => closeBtn?.focus(), 100);

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
    <div className="lg:hidden">
      {/* Hamburger Button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-md text-[#2D2D2D] hover:bg-gray-100 dark:text-[#E0E0E0] dark:hover:bg-gray-800 transition-colors duration-200 min-w-[44px] min-h-[44px] cursor-pointer"
        aria-expanded={isOpen}
        aria-controls="mobile-drawer"
        aria-label={t('menu')}
      >
        <MenuIcon size={24} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Drawer Panel (side="right") */}
      <div
        ref={drawerRef}
        id="mobile-drawer"
        className={`fixed top-0 right-0 h-full w-[80%] max-w-[320px] bg-white dark:bg-[#121212] shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={t('mobileNavigation')}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#CCCCCC] dark:border-[#333333]">
            <span className="text-lg font-semibold text-[#2D2D2D] dark:text-[#E0E0E0] font-sans">
              {t('menu')}
            </span>
            <button
              onClick={close}
              className="p-2 rounded-md text-[#2D2D2D] hover:bg-gray-100 dark:text-[#E0E0E0] dark:hover:bg-gray-800 transition-colors duration-200 min-w-[44px] min-h-[44px] cursor-pointer"
              aria-label={t('closeMenu')}
            >
              <CloseIcon size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav
            className="flex-1 overflow-y-auto py-4"
            aria-label={t('mobileNavigation')}
          >
            <ul className="space-y-1 px-4">
              {navItems.map((item) => (
                <MobileNavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  onClose={close}
                />
              ))}
            </ul>
          </nav>

          {/* Phone CTA */}
          <div className="p-4 border-t border-[#CCCCCC] dark:border-[#333333]">
            <ButtonLink
              href="tel:3015788779"
              variant="primary"
              size="md"
              className="w-full"
              aria-label={`${c('callNow')} ${t('phone')}`}
            >
              <PhoneIcon size={20} className="mr-2" ariaLabel="" />
              <span>{t('phone')}</span>
            </ButtonLink>
          </div>

          {/* Get a Quote */}
          <div className="px-4 pb-4">
            <ButtonLink
              href="/contact"
              variant="secondary"
              size="md"
              className="w-full"
              onClick={close}
            >
              {c('getQuote')}
            </ButtonLink>
          </div>

          {/* Toggles */}
          <div className="p-4 border-t border-[#CCCCCC] dark:border-[#333333]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
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
