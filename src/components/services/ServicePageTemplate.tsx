'use client';

import { useTranslations } from 'next-intl';
import { ServiceHero } from './ServiceHero';
import { WhatWeOffer } from './WhatWeOffer';
import { ServiceAreas } from './ServiceAreas';
import { ServiceTestimonial } from './ServiceTestimonial';
import { CTABanner } from './CTABanner';
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

export function ServicePageTemplate({
  serviceKey,
  heroSlug,
  heroMedia,
  heroAlt,
}: ServicePageTemplateProps) {
  const t = useTranslations('services');
  const h = useTranslations('header');

  const page = (key: string) => t(`pages.${serviceKey}.${key}`);

  const offerings = OFFERING_KEYS.map((item) => ({
    title: t(`pages.${serviceKey}.offerings.${item}.title`),
    description: t(`pages.${serviceKey}.offerings.${item}.description`),
  }));

  const testimonial = {
    quote: page('testimonial.quote'),
    author: page('testimonial.author'),
    location: page('testimonial.location'),
    rating: 5,
  };

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

      <ServiceTestimonial testimonial={testimonial} />

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
