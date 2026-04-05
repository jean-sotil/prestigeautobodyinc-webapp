'use client';

import { useTranslations } from 'next-intl';

interface Stat {
  id: string;
  value: string;
  label: string;
}

export function StatsCounters() {
  const t = useTranslations('home');

  const stats: Stat[] = [
    {
      id: 'experience',
      value: t('stats.experience.value'),
      label: t('stats.experience.label'),
    },
    {
      id: 'rating',
      value: t('stats.rating.value'),
      label: t('stats.rating.label'),
    },
    {
      id: 'cars',
      value: t('stats.cars.value'),
      label: t('stats.cars.label'),
    },
    {
      id: 'reviews',
      value: t('stats.reviews.value'),
      label: t('stats.reviews.label'),
    },
  ];

  return (
    <section className="bg-[#f5f5f5] py-8" aria-labelledby="stats-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="stats-heading" className="sr-only">
          {t('stats.title')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col items-center text-center gap-1"
            >
              <div className="text-4xl font-black text-[#2d2d2d]">
                {stat.value}
              </div>
              <div className="text-sm text-[#555]">{stat.label}</div>
              <div className="text-[#c62828] text-xs">★★★★★</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
