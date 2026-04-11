'use client';

import { useTranslations } from 'next-intl';
import { CheckCircleIcon } from '@/components/ui/Icons';

const VALUE_KEYS = [
  'experience',
  'certified',
  'warranty',
  'insurance',
  'equipment',
  'community',
] as const;

export function AboutContent() {
  const t = useTranslations('about');

  return (
    <>
      {/* Intro */}
      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t('intro')}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-12 md:py-16 bg-muted">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-2xl md:text-3xl font-bold text-foreground tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('missionTitle')}
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            {t('mission')}
          </p>
        </div>
      </section>

      {/* Values grid */}
      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-2xl md:text-3xl font-bold text-foreground tracking-tight text-center"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('valuesTitle')}
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {VALUE_KEYS.map((key) => (
              <div key={key} className="flex gap-4">
                <div className="shrink-0 mt-0.5">
                  <CheckCircleIcon
                    size={24}
                    className="text-primary"
                    ariaLabel=""
                  />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {t(`values.${key}.title`)}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {t(`values.${key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
