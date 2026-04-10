'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

export interface NavItem {
  href: string;
  label: string;
}

export function useNavItems(): NavItem[] {
  const t = useTranslations('nav');

  return [
    { href: '/collision-repair', label: t('collisionRepair') },
    { href: '/auto-body-services', label: t('autoBodyServices') },
    { href: '/auto-painting', label: t('autoPainting') },
    { href: '/insurance-claims', label: t('insuranceClaims') },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
  ];
}

export function useIsActiveLink(href: string): boolean {
  const pathname = usePathname();
  const locale = useLocale();

  return (
    pathname === href ||
    pathname === `/${locale}${href}` ||
    (href !== '/' && pathname.startsWith(`/${locale}${href}`))
  );
}

export function NavLink({
  item,
  onClick,
}: {
  item: NavItem;
  onClick?: () => void;
}) {
  const isActive = useIsActiveLink(item.href);

  return (
    <Link
      href={item.href as '/'}
      onClick={onClick}
      className={`py-2 text-sm font-medium transition-colors duration-200 ${
        isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {item.label}
    </Link>
  );
}
