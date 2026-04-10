'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MenuIcon, PhoneIcon } from '@/components/ui/Icons';
import { Button, ButtonLink } from '@/components/ui/Button';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
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
        className={`block px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-foreground hover:bg-muted hover:text-primary'
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        {label}
      </Link>
    </li>
  );
}

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslations('header');
  const c = useTranslations('common');
  const navItems = useNavItems();

  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="min-w-[44px] min-h-[44px]"
              aria-label={t('menu')}
            />
          }
        >
          <MenuIcon size={24} />
        </SheetTrigger>

        <SheetContent side="right" showCloseButton>
          <SheetHeader>
            <SheetTitle>{t('menu')}</SheetTitle>
          </SheetHeader>

          {/* Navigation Links */}
          <nav
            className="flex-1 overflow-y-auto"
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
          <div className="px-4">
            <ButtonLink
              href="tel:3015788779"
              variant="primary"
              size="md"
              className="w-full rounded-full shadow-lg"
              aria-label={`${c('callNow')} ${t('phone')}`}
            >
              <PhoneIcon size={20} ariaLabel="" />
              <span>{t('phone')}</span>
            </ButtonLink>
          </div>

          {/* Get a Quote */}
          <div className="px-4">
            <ButtonLink
              href="/contact"
              variant="primary"
              size="md"
              className="w-full rounded-full shadow-lg"
              onClick={close}
            >
              {c('getQuote')}
            </ButtonLink>
          </div>

          {/* Language Toggle */}
          <div className="px-4 pb-4 border-t border-border pt-4">
            <LanguageSwitcher />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
