'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { MenuIcon, PhoneIcon } from '@/components/ui/Icons';
import { Button, ButtonLink } from '@/components/ui/Button';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/Sheet';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/Collapsible';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { SHOP_PHONE_TEL } from '@/lib/business';
import {
  useNavStructure,
  useIsActiveLink,
  useIsGroupActive,
  type NavItem,
} from './NavLinks';

function MobileNavLink({
  href,
  label,
  onClose,
  nested = false,
}: {
  href: string;
  label: string;
  onClose: () => void;
  nested?: boolean;
}) {
  const isActive = useIsActiveLink(href);

  return (
    <li>
      <Link
        href={href as '/'}
        onClick={onClose}
        className={`block ${nested ? 'pl-8 pr-4' : 'px-4'} py-3 rounded-md text-base font-medium transition-colors duration-200 ${
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

function MobileServicesGroup({
  label,
  items,
  onClose,
}: {
  label: string;
  items: NavItem[];
  onClose: () => void;
}) {
  const groupActive = useIsGroupActive(items);
  const [open, setOpen] = useState(groupActive);

  return (
    <li>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger
          className={`flex w-full items-center justify-between px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
            groupActive
              ? 'text-primary'
              : 'text-foreground hover:bg-muted hover:text-primary'
          }`}
          aria-expanded={open}
        >
          <span>{label}</span>
          <ChevronDown
            className={`h-5 w-5 transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul className="space-y-1 py-1">
            {items.map((item) => (
              <MobileNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                onClose={onClose}
                nested
              />
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
}

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslations('header');
  const c = useTranslations('common');
  const navStructure = useNavStructure();

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
              aria-expanded={open}
            />
          }
        >
          <MenuIcon size={24} />
        </SheetTrigger>

        <SheetContent side="right" showCloseButton>
          <SheetHeader>
            <SheetTitle>{t('menu')}</SheetTitle>
          </SheetHeader>

          <nav
            className="flex-1 overflow-y-auto"
            aria-label={t('mobileNavigation')}
          >
            <ul className="space-y-1 px-4">
              {navStructure.map((entry) => {
                if (entry.type === 'group') {
                  return (
                    <MobileServicesGroup
                      key="services"
                      label={entry.label}
                      items={entry.items}
                      onClose={close}
                    />
                  );
                }
                return (
                  <MobileNavLink
                    key={entry.href}
                    href={entry.href}
                    label={entry.label}
                    onClose={close}
                  />
                );
              })}
            </ul>
          </nav>

          <div className="mx-4 my-2 border-t border-border" role="separator" />

          <div className="px-4">
            <a
              href={`tel:${SHOP_PHONE_TEL}`}
              onClick={close}
              className="flex items-center gap-2 py-3 font-bold text-foreground hover:text-primary transition-colors"
              aria-label={`${c('callNow')} ${t('phone')}`}
            >
              <PhoneIcon size={20} ariaLabel="" />
              <span>{t('phone')}</span>
            </a>
          </div>

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

          <div className="px-4 pb-4 border-t border-border pt-4 mt-2">
            <LanguageSwitcher />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
