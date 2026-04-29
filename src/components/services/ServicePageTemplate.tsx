import { getTranslations } from 'next-intl/server';
import { ServiceHero } from './ServiceHero';
import { WhatWeOffer } from './WhatWeOffer';
import { ServiceAreas } from './ServiceAreas';
import { CTABanner } from './CTABanner';
import { GoogleReviewsCarousel } from '@/components/embeds/GoogleReviewsCarousel';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { HeroMedia } from '@/lib/heroMedia';

const OFFERING_KEYS = [
  'item1',
  'item2',
  'item3',
  'item4',
  'item5',
  'item6',
] as const;

interface ServicePageTemplateProps {
  /** i18n key under services.pages (e.g. "collisionRepair") */
  serviceKey: string;
  /** Hero image slug for responsive <picture> paths */
  heroSlug: string;
  /** Optional Payload-served hero media; falls back to static /hero/{slug}/ if absent. */
  heroMedia?: HeroMedia | null;
  /** Pre-resolved alt text (e.g. via pickAlt). Overrides the translation lookup when provided. */
  heroAlt?: string;
}

export async function ServicePageTemplate({
  serviceKey,
  heroSlug,
  heroMedia,
  heroAlt,
}: ServicePageTemplateProps) {
  const [t, h, r] = await Promise.all([
    getTranslations('services'),
    getTranslations('header'),
    getTranslations('reviews'),
  ]);

  const page = (key: string) => t(`pages.${serviceKey}.${key}`);

  const offerings = OFFERING_KEYS.map((item) => ({
    title: t(`pages.${serviceKey}.offerings.${item}.title`),
    description: t(`pages.${serviceKey}.offerings.${item}.description`),
  }));

  return (
    <div>
      <ServiceHero
        slug={heroSlug}
        imageAlt={heroAlt ?? page('heroImageAlt')}
        title={page('title')}
        description={page('heroDescription')}
        ctaEstimateLabel={t('getEstimate')}
        ctaPhoneLabel={`Call ${h('phone')}`}
        phone="3015788779"
        phoneDisplay={h('phone')}
        media={heroMedia}
      />

      <WhatWeOffer heading={t('whatWeOffer')} items={offerings} />

      <ServiceAreas heading={t('serviceAreas')} />

      <section
        className="py-16 bg-[#F5F5F5] dark:bg-[#1E1E1E]"
        aria-labelledby={`reviews-${serviceKey}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6">
          <SectionHeading
            id={`reviews-${serviceKey}`}
            overline={r('sectionOverline')}
            heading={r('sectionHeading')}
            centered
          />
          <GoogleReviewsCarousel />
        </div>
      </section>

      <CTABanner
        headline={t('ctaHeadline')}
        subtitle={t('ctaSubtitle')}
        ctaQuoteLabel={t('ctaQuote')}
        ctaPhoneLabel={`Call ${h('phone')}`}
        phone="3015788779"
        phoneDisplay={h('phone')}
      />
    </div>
  );
}
