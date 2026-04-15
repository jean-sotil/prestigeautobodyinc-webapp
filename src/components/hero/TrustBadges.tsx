'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface TrustBadge {
  id: string;
  name: string;
  description: string;
  logo: string;
  alt: string;
}

export function TrustBadges() {
  const t = useTranslations('home');

  const badges: TrustBadge[] = [
    {
      id: 'icar',
      name: t('trustBadges.icar.name'),
      description: t('trustBadges.icar.description'),
      logo: '/badges/icar-gold.svg',
      alt: t('trustBadges.icar.alt'),
    },
    {
      id: 'carwise',
      name: t('trustBadges.carwise.name'),
      description: t('trustBadges.carwise.description'),
      logo: '/badges/carwise-verified.svg',
      alt: t('trustBadges.carwise.alt'),
    },
    {
      id: 'lifetime',
      name: t('trustBadges.lifetime.name'),
      description: t('trustBadges.lifetime.description'),
      logo: '/badges/lifetime-guarantee.svg',
      alt: t('trustBadges.lifetime.alt'),
    },
    {
      id: 'rating',
      name: t('trustBadges.rating.name'),
      description: t('trustBadges.rating.description'),
      logo: '/badges/star-rating.svg',
      alt: t('trustBadges.rating.alt'),
    },
  ];

  return (
    <section
      className="bg-white dark:bg-gray-900 py-8 border-b border-gray-200 dark:border-gray-800"
      aria-labelledby="trust-badges-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="trust-badges-heading" className="sr-only">
          {t('trustBadges.title')}
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"
            >
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={badge.logo}
                  alt={badge.alt}
                  fill
                  className="object-contain"
                  sizes="48px"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  {badge.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {badge.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
