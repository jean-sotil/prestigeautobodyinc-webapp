'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

export interface NavItem {
  href: string;
  label: string;
  description?: string;
}

export interface NavGroup {
  type: 'group';
  label: string;
  description?: string;
  items: NavItem[];
}

export interface NavLeaf extends NavItem {
  type: 'link';
}

export type NavEntry = NavGroup | NavLeaf;

export function useServiceItems(): NavItem[] {
  const t = useTranslations('nav');
  return [
    {
      href: '/collision-repair',
      label: t('collisionRepair'),
      description: t('collisionRepairDesc'),
    },
    {
      href: '/auto-body-services',
      label: t('autoBodyServices'),
      description: t('autoBodyServicesDesc'),
    },
    {
      href: '/auto-painting',
      label: t('autoPainting'),
      description: t('autoPaintingDesc'),
    },
  ];
}

export function useNavStructure(): NavEntry[] {
  const t = useTranslations('nav');
  const services = useServiceItems();

  return [
    {
      type: 'group',
      label: t('services'),
      description: t('servicesDescription'),
      items: services,
    },
    { type: 'link', href: '/insurance-claims', label: t('insurance') },
    { type: 'link', href: '/about', label: t('about') },
    { type: 'link', href: '/contact', label: t('contact') },
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

export function useIsGroupActive(items: NavItem[]): boolean {
  const pathname = usePathname();
  const locale = useLocale();
  return items.some(
    (item) =>
      pathname === item.href ||
      pathname === `/${locale}${item.href}` ||
      pathname.startsWith(`/${locale}${item.href}`),
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
      className={`inline-flex items-center border-b-2 py-1 text-sm font-medium transition-colors duration-200 ${
        isActive
          ? 'text-primary border-primary'
          : 'text-foreground border-transparent hover:text-primary'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {item.label}
    </Link>
  );
}
