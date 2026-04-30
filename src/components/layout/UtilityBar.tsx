'use client';

import { useTranslations } from 'next-intl';
import { LocationIcon, ClockIcon } from '@/components/ui/Icons';
import { Caption } from '@/components/ui/Typography';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function UtilityBar() {
  const t = useTranslations('header');

  return (
    <div className="bg-foreground text-background h-10 hidden lg:flex items-center sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between gap-6">
        <Caption color="inverse" className="flex items-center gap-1.5">
          <LocationIcon
            size={14}
            className="shrink-0 opacity-70"
            ariaLabel=""
          />
          {t('address')}
        </Caption>

        <Caption
          color="inverse"
          className="hidden xl:flex items-center gap-1.5"
        >
          <ClockIcon size={14} className="shrink-0 opacity-70" ariaLabel="" />
          {t('hours')}
        </Caption>

        <div className="flex items-center gap-3">
          <Caption
            color="inverse"
            className="xl:hidden flex items-center gap-1.5"
          >
            <ClockIcon size={14} className="shrink-0 opacity-70" ariaLabel="" />
            {t('hours')}
          </Caption>
          <span
            aria-hidden="true"
            className="hidden xl:inline-block h-3 w-px bg-background/25"
          />
          <LanguageSwitcher tone="onDark" />
        </div>
      </div>
    </div>
  );
}
