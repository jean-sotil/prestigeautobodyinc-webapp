'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { ButtonLink } from '@/components/ui/Button';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Caption } from '@/components/ui/Typography';
import { PhoneIcon } from '@/components/ui/Icons';
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
import {
  useNavStructure,
  useIsActiveLink,
  useIsGroupActive,
  NavLink,
  type NavItem,
} from './NavLinks';

function ServiceLinkCard({ item }: { item: NavItem }) {
  const isActive = useIsActiveLink(item.href);
  return (
    <NavigationMenuLink
      render={
        <Link
          href={item.href as '/'}
          aria-current={isActive ? 'page' : undefined}
        />
      }
      className="flex flex-col gap-1 rounded-md p-3 hover:bg-muted focus:bg-muted"
    >
      <span
        className={`text-sm font-medium ${
          isActive ? 'text-primary' : 'text-foreground'
        }`}
      >
        {item.label}
      </span>
      {item.description && (
        <span className="text-xs text-muted-foreground line-clamp-2">
          {item.description}
        </span>
      )}
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

  const isHomePage = pathname === `/${locale}` || pathname === '/';

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
        className={`sticky lg:top-10 top-0 z-40 h-14 bg-background/90 backdrop-blur-md transition-shadow duration-200 ${
          scrolled ? 'shadow-md' : 'shadow-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full gap-4">
            <div className="shrink-0">
              <Link
                href="/"
                className="inline-flex hover:opacity-80 transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
                aria-label="Prestige Auto Body Inc. - Home"
              >
                <Image
                  src="/logo.png"
                  alt="Prestige Auto Body Inc. Logo"
                  width={140}
                  height={40}
                  priority
                />
              </Link>
            </div>

            <NavigationMenu
              className="hidden lg:flex"
              aria-label={t('mainNavigation')}
            >
              <NavigationMenuList className="gap-6">
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
              <div className="hidden lg:flex flex-col items-end leading-tight">
                <a
                  href="tel:3015788779"
                  className="inline-flex items-center gap-1.5 font-bold text-sm text-foreground hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                  aria-label={`${c('callNow')} ${t('phone')}`}
                >
                  <PhoneIcon size={16} ariaLabel="" />
                  {t('phone')}
                </a>
                <Caption color="muted">{t('callForEstimate')}</Caption>
              </div>

              <a
                href="tel:3015788779"
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
                  className="rounded-full shadow-lg"
                >
                  {c('getQuote')}
                </ButtonLink>
              </div>

              <div className="hidden lg:block">
                <LanguageSwitcher />
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
        <ul className="grid w-[360px] gap-1 p-2">
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
