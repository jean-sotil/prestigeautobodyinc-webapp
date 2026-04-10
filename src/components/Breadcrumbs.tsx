'use client';

import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ChevronRightIcon } from '@/components/ui/Icons';

interface BreadcrumbItem {
  href: string;
  label: string;
  isLast: boolean;
}

function HomeBreadcrumb({ isLast }: { isLast: boolean }) {
  const t = useTranslations('nav');

  if (isLast) {
    return (
      <span className="flex items-center text-gray-500" aria-current="page">
        <HomeIcon size={16} className="mr-1" ariaLabel="" />
        {t('home')}
      </span>
    );
  }

  return (
    <Link
      href="/"
      className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
      aria-label={t('home')}
    >
      <HomeIcon size={16} className="mr-1" ariaLabel="" />
      <span className="sr-only">{t('home')}</span>
    </Link>
  );
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('nav');

  // Don't show breadcrumbs on homepage
  if (pathname === `/${locale}` || pathname === '/') {
    return null;
  }

  // Remove locale prefix and split path
  const pathWithoutLocale =
    pathname.replace(new RegExp(`^/${locale}`), '') || '/';
  const segments = pathWithoutLocale.split('/').filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  // Build breadcrumb items
  const items: BreadcrumbItem[] = [];
  let currentPath = '';

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    // Map segment to translation key
    const label = getBreadcrumbLabel(segment, t);

    items.push({
      href: currentPath as '/',
      label,
      isLast,
    });
  });

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex flex-wrap items-center space-x-2 text-sm">
        {/* Home link */}
        <li className="flex items-center">
          <HomeBreadcrumb isLast={items.length === 0} />
        </li>

        {/* Separator and items */}
        {items.map((item) => (
          <li key={item.href} className="flex items-center">
            <ChevronRightIcon
              size={16}
              className="mx-2 text-gray-400"
              ariaLabel=""
            />
            {item.isLast ? (
              <span
                className="text-gray-900 dark:text-white font-medium"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href as '/'}
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function getBreadcrumbLabel(
  segment: string,
  t: (key: string) => string,
): string {
  // Map URL segments to translation keys
  const mapping: Record<string, string> = {
    'collision-repair': 'collisionRepair',
    'auto-body-services': 'autoBodyServices',
    'auto-painting': 'autoPainting',
    towing: 'towing',
    'insurance-claims': 'insuranceClaims',
    'rental-assistance': 'rentalAssistance',
    about: 'about',
    'our-team': 'ourTeam',
    certifications: 'certifications',
    contact: 'contact',
    locations: 'locations',
    gallery: 'gallery',
  };

  const key = mapping[segment];
  if (key) {
    return t(key);
  }

  // Fallback: capitalize and replace hyphens with spaces
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Home icon for breadcrumbs
function HomeIcon({
  className = '',
  size = 24,
  ariaLabel = 'Home',
}: {
  className?: string;
  size?: number;
  ariaLabel?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label={ariaLabel}
      role="img"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
