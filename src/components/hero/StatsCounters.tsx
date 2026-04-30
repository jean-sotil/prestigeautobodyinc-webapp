import { getTranslations } from 'next-intl/server';
import { type ReactNode } from 'react';

interface Stat {
  id: string;
  icon: ReactNode;
  value: string;
  label: string;
}

function TrophyIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-3.5-5.4A2 2 0 0 0 12.8 4H5.2c-.7 0-1.3.3-1.7.8L0 10v6c0 .6.4 1 1 1h1" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

function StarClusterIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12 9 13.7 12.4 17.5 13 14.75 15.65 15.4 19.4 12 17.6 8.6 19.4 9.25 15.65 6.5 13 10.3 12.4 12 9" />
      <polygon points="5 3 5.7 4.4 7.2 4.6 6.1 5.65 6.35 7.15 5 6.45 3.65 7.15 3.9 5.65 2.8 4.6 4.3 4.4 5 3" />
      <polygon points="19 3 19.7 4.4 21.2 4.6 20.1 5.65 20.35 7.15 19 6.45 17.65 7.15 17.9 5.65 16.8 4.6 18.3 4.4 19 3" />
    </svg>
  );
}

interface StatsCountersProps {
  ratingValue?: number;
  reviewCount?: number;
  locale?: string;
}

export async function StatsCounters({
  ratingValue,
  reviewCount,
  locale,
}: StatsCountersProps = {}) {
  const t = await getTranslations({
    locale: locale || 'en',
    namespace: 'home',
  });

  const ratingValueDisplay =
    typeof ratingValue === 'number'
      ? `${ratingValue.toFixed(1)}★`
      : t('stats.rating.value');

  const reviewCountDisplay =
    typeof reviewCount === 'number'
      ? `${reviewCount}+`
      : t('stats.reviews.value');

  const stats: Stat[] = [
    {
      id: 'experience',
      icon: <TrophyIcon />,
      value: t('stats.experience.value'),
      label: t('stats.experience.label'),
    },
    {
      id: 'rating',
      icon: <StarIcon />,
      value: ratingValueDisplay,
      label: t('stats.rating.label'),
    },
    {
      id: 'cars',
      icon: <CarIcon />,
      value: t('stats.cars.value'),
      label: t('stats.cars.label'),
    },
    {
      id: 'reviews',
      icon: <StarClusterIcon />,
      value: reviewCountDisplay,
      label: t('stats.reviews.label'),
    },
  ];

  return (
    <section
      className="bg-[#F5F5F5] dark:bg-[#1E1E1E] py-10 lg:py-12"
      aria-labelledby="stats-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="stats-heading" className="sr-only">
          {t('stats.title')}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-[var(--border)]">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col items-center text-center gap-1 py-2"
            >
              <div className="w-12 h-12 rounded-full border-2 border-[#C62828] flex items-center justify-center text-[#C62828] mb-2">
                {stat.icon}
              </div>
              <div
                className="text-4xl lg:text-5xl font-extrabold text-[#C62828]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-[var(--text-secondary)]">
                {stat.label}
              </div>
              <div className="text-[#C62828] text-xs">★★★★★</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
