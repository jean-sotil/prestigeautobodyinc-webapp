'use client';

import { useTranslations } from 'next-intl';
import { LocationIcon, ClockIcon } from '@/components/ui/Icons';

export default function UtilityBar() {
  const t = useTranslations('header');

  return (
    <div className="bg-[#2D2D2D] dark:bg-[#0A0A0A] text-white text-xs font-sans h-10 hidden md:flex items-center sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <LocationIcon
            size={14}
            className="shrink-0 opacity-70"
            ariaLabel=""
          />
          {t('address')}
        </span>
        <span className="flex items-center gap-1.5">
          <ClockIcon size={14} className="shrink-0 opacity-70" ariaLabel="" />
          {t('hours')}
        </span>
      </div>
    </div>
  );
}
