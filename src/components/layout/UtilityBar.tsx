'use client';

import { useTranslations } from 'next-intl';
import { LocationIcon, ClockIcon } from '@/components/ui/Icons';
import { Caption } from '@/components/ui/Typography';

export default function UtilityBar() {
  const t = useTranslations('header');

  return (
    <div className="bg-foreground text-background h-10 hidden md:flex items-center sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
        <Caption color="inverse" className="flex items-center gap-1.5">
          <LocationIcon
            size={14}
            className="shrink-0 opacity-70"
            ariaLabel=""
          />
          {t('address')}
        </Caption>
        <Caption color="inverse" className="flex items-center gap-1.5">
          <ClockIcon size={14} className="shrink-0 opacity-70" ariaLabel="" />
          {t('hours')}
        </Caption>
      </div>
    </div>
  );
}
