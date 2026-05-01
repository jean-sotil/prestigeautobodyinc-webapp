'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { ButtonLink } from '@/components/ui/Button';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Caption } from '@/components/ui/Typography';
import {
  PhoneIcon,
  CarIcon,
  WrenchIcon,
  PaintbrushIcon,
  ChevronRightIcon,
} from '@/components/ui/Icons';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/NavigationMenu';
import UtilityBar from './UtilityBar';
import MobileNav from './MobileNav';
import { SHOP_PHONE_TEL } from '@/lib/business';
import {
  useNavStructure,
  useIsActiveLink,
  useIsGroupActive,
  NavLink,
  type NavItem,
} from './NavLinks';

type ServiceIcon = (props: {
  size?: number;
  className?: string;
  ariaLabel?: string;
}) => React.ReactElement;

const SERVICE_ICONS: Record<string, ServiceIcon> = {
  '/collision-repair': CarIcon,
  '/auto-body-services': WrenchIcon,
  '/auto-painting': PaintbrushIcon,
};

function ServiceLinkCard({ item }: { item: NavItem }) {
  const isActive = useIsActiveLink(item.href);
  const Icon = SERVICE_ICONS[item.href];

  return (
    <NavigationMenuLink
      render={
        <Link
          href={item.href as '/'}
          aria-current={isActive ? 'page' : undefined}
        />
      }
      className={`group/service relative flex items-start gap-3 rounded-md p-3 transition-colors ${
        isActive ? 'bg-primary/5' : 'hover:bg-muted focus:bg-muted'
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute left-0 top-3 bottom-3 w-[2px] rounded-full transition-opacity ${
          isActive
            ? 'bg-primary opacity-100'
            : 'bg-primary opacity-0 group-hover/service:opacity-100 group-focus/service:opacity-100'
        }`}
      />
      {Icon && (
        <span
          className={`mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-md transition-colors ${
            isActive
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground group-hover/service:bg-primary/10 group-hover/service:text-primary group-focus/service:bg-primary/10 group-focus/service:text-primary'
          }`}
        >
          <Icon size={18} ariaLabel="" />
        </span>
      )}
      <span className="flex min-w-0 flex-col gap-0.5 text-left">
        <span
          className={`text-sm font-semibold leading-tight ${
            isActive ? 'text-primary' : 'text-foreground'
          }`}
        >
          {item.label}
        </span>
        {item.description && (
          <span className="text-xs leading-snug text-muted-foreground line-clamp-2">
            {item.description}
          </span>
        )}
      </span>
      <ChevronRightIcon
        size={14}
        ariaLabel=""
        className={`mt-2 ml-auto shrink-0 self-start transition-all ${
          isActive
            ? 'text-primary opacity-100 translate-x-0'
            : 'text-muted-foreground/40 opacity-0 -translate-x-1 group-hover/service:opacity-100 group-hover/service:translate-x-0 group-focus/service:opacity-100 group-focus/service:translate-x-0'
        }`}
      />
    </NavigationMenuLink>
  );
}

export default function Header() {
  const t = useTranslations('header');
  const c = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const navStructure = useNavStructure();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleLogoClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        'a[aria-label="Prestige Auto Body Inc. - Home"]',
      );
      if (!target) return;

      const currentPath = window.location.pathname;
      const onHome =
        currentPath === `/${locale}` ||
        currentPath === '/' ||
        currentPath === `/${locale}/`;

      if (onHome) {
        e.preventDefault();
        e.stopPropagation();
        const forceScroll = () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        };
        forceScroll();
        requestAnimationFrame(forceScroll);
        [50, 100, 150, 200, 250, 300, 400, 500].forEach((delay) =>
          setTimeout(forceScroll, delay),
        );
      }
    };

    document.addEventListener('click', handleLogoClick, true);
    return () => document.removeEventListener('click', handleLogoClick, true);
  }, [locale]);

  const isHomePage =
    pathname === `/${locale}` || pathname === '/' || pathname === `/${locale}/`;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[60] bg-background text-primary px-4 py-2 rounded-md font-medium shadow-lg border-2 border-primary"
      >
        {t('skipToContent')}
      </a>

      <UtilityBar />

      <header
        className={`header-edge-accent sticky overflow-hidden z-40 h-16 bg-background/90 backdrop-blur-md border-b border-border/60 transition-shadow duration-200 ${
          scrolled ? 'shadow-md' : 'shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full gap-3 lg:gap-4 xl:gap-6">
            <div className="shrink-0">
              <Link
                href="/"
                className="inline-flex hover:opacity-80 transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
                aria-label="Prestige Auto Body Inc. - Home"
              >
                <Image
                  src="/logo.png"
                  alt="Prestige Auto Body Inc. Logo"
                  width={220}
                  height={40}
                  priority
                  className="h-9 w-auto xl:h-10"
                />
              </Link>
            </div>

            <NavigationMenu
              className="hidden lg:flex"
              aria-label={t('mainNavigation')}
            >
              <NavigationMenuList className="gap-4 xl:gap-6">
                {navStructure.map((entry) => {
                  if (entry.type === 'link') {
                    return (
                      <NavigationMenuItem key={entry.href}>
                        <NavLink item={entry} />
                      </NavigationMenuItem>
                    );
                  }
                  return (
                    <ServicesMenu
                      key="services"
                      label={entry.label}
                      items={entry.items}
                    />
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-2 lg:gap-3">
              <a
                href={`tel:${SHOP_PHONE_TEL}`}
                className="hidden lg:inline-flex items-center gap-2 font-bold text-sm text-foreground hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm whitespace-nowrap"
                aria-label={`${c('callNow')} ${t('phone')}`}
              >
                <PhoneIcon size={16} ariaLabel="" />
                <span className="flex flex-col items-start leading-tight">
                  <span>{t('phone')}</span>
                  <Caption
                    color="muted"
                    className="hidden xl:inline-block font-normal"
                  >
                    {t('callForEstimate')}
                  </Caption>
                </span>
              </a>

              <a
                href={`tel:${SHOP_PHONE_TEL}`}
                className="lg:hidden inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-md text-foreground hover:text-primary hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={`${c('callNow')} ${t('phone')}`}
              >
                <PhoneIcon size={22} ariaLabel="" />
              </a>

              <div className="hidden lg:block">
                <ButtonLink
                  href="/get-a-quote"
                  variant="primary"
                  size="sm"
                  className="rounded-full shadow-lg whitespace-nowrap"
                >
                  {c('getQuote')}
                </ButtonLink>
              </div>

              <MobileNav />
            </div>
          </div>
        </div>

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

function ServicesMenu({ label, items }: { label: string; items: NavItem[] }) {
  const isActive = useIsGroupActive(items);
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        className={`border-b-2 px-0 py-1 text-sm font-medium bg-transparent hover:bg-transparent focus:bg-transparent data-[popup-open]:bg-transparent ${
          isActive
            ? 'text-primary border-primary'
            : 'text-foreground border-transparent hover:text-primary'
        }`}
      >
        {label}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[420px] gap-0.5 p-2">
          {items.map((item) => (
            <li key={item.href}>
              <ServiceLinkCard item={item} />
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
