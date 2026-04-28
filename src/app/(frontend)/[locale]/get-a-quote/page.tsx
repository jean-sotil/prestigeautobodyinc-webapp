import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BASE_URL } from '@/lib/seo';
import { PageHeroBanner } from '@/components/hero';
import LazyQuoteForm from '@/components/dynamic/LazyQuoteForm';
import { getBusinessRating } from '@/lib/google-places';
import { getHeroMedia, pickAlt } from '@/lib/heroMedia';
import {
  PhoneIcon,
  LocationIcon,
  ClockIcon,
  AwardIcon,
  ShieldIcon,
  CheckCircleIcon,
  TowTruckIcon,
  StarIcon,
} from '@/components/ui/Icons';

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const;
const INSURERS = [
  'geico',
  'stateFarm',
  'allstate',
  'progressive',
  'usaa',
] as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'quotePage.meta' });

  const enPath = '/en/get-a-quote';
  const esPath = '/es/obtener-cotizacion';
  const currentPath = locale === 'es' ? esPath : enPath;
  const ogImage = '/og-image.jpg';

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${BASE_URL}${currentPath}`,
      languages: {
        en: `${BASE_URL}${enPath}`,
        es: `${BASE_URL}${esPath}`,
        'x-default': `${BASE_URL}${enPath}`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${BASE_URL}${currentPath}`,
      locale: locale === 'es' ? 'es_US' : 'en_US',
      alternateLocale: locale === 'en' ? 'es_US' : 'en_US',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: t('title') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [ogImage],
    },
  };
}

export default async function GetAQuotePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, rating, heroMedia] = await Promise.all([
    getTranslations({ locale, namespace: 'quotePage' }),
    getBusinessRating(),
    getHeroMedia('auto-body-services'),
  ]);

  const currentPath = locale === 'es' ? '/obtener-cotizacion' : '/get-a-quote';
  const currentUrl = `${BASE_URL}/${locale}${currentPath}`;
  const homeUrl = `${BASE_URL}/${locale}`;
  const ratingDisplay = rating.ratingValue.toFixed(1);
  const reviewCount = rating.reviewCount;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('hero.breadcrumbHome'),
        item: homeUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('hero.breadcrumbCurrent'),
        item: currentUrl,
      },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_KEYS.map((key) => ({
      '@type': 'Question',
      name: t(`faq.items.${key}.question`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(`faq.items.${key}.answer`),
      },
    })),
  };

  const whyChoose: Array<{
    key: 'icar' | 'warranty' | 'insurance' | 'towing';
    Icon: typeof AwardIcon;
  }> = [
    { key: 'icar', Icon: AwardIcon },
    { key: 'warranty', Icon: ShieldIcon },
    { key: 'insurance', Icon: CheckCircleIcon },
    { key: 'towing', Icon: TowTruckIcon },
  ];

  return (
    <div className="font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div>
        {/* ─────────────── Section A — Hero Banner ─────────────── */}
        <PageHeroBanner
          slug="auto-body-services"
          alt={pickAlt(heroMedia, locale, t('hero.imageAlt'))}
          title={t('hero.imageTitle')}
          heading={t('hero.h1')}
          subtitle={t('hero.tagline')}
          media={heroMedia}
        />

        {/* ─────────────── Section B — Stats + QuoteForm (sticky sidebar) ─────────────── */}
        <div className="bg-gray-50 dark:bg-[#1E1E1E]">
          {/* Stats strip, aligned with QuoteForm's max-w-7xl when sidebar present */}
          <div className="max-w-7xl mx-auto px-4 pt-12 lg:pt-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full bg-[#C62828]/10 border border-[#C62828]/25 text-xs font-medium text-[#C62828]">
              {t('hero.badge')}
            </div>
            <div className="grid grid-cols-3 gap-4 sm:gap-8 border-b border-[#CCCCCC] dark:border-[#333333] pb-8">
              <div>
                <p
                  className="font-extrabold text-2xl sm:text-3xl text-[#C62828] leading-none"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {t('hero.stats.response.value')}
                </p>
                <p className="text-xs text-[#555555] dark:text-[#A0A0A0] mt-1.5">
                  {t('hero.stats.response.label')}
                </p>
              </div>
              <div>
                <p
                  className="font-extrabold text-2xl sm:text-3xl text-[#C62828] leading-none"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {t('hero.stats.insurance.value')}
                </p>
                <p className="text-xs text-[#555555] dark:text-[#A0A0A0] mt-1.5">
                  {t('hero.stats.insurance.label')}
                </p>
              </div>
            </div>
          </div>

          <LazyQuoteForm
            sidebar={
              <>
                {/* Card 1 — Call */}
                <div className="rounded-2xl bg-white dark:bg-[#252525] border border-[#CCCCCC] dark:border-[#333333] p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#555555] dark:text-[#A0A0A0] mb-2">
                    {t('sidebar.callLabel')}
                  </p>
                  <a
                    href="tel:3015788779"
                    className="flex items-center gap-2 font-bold text-2xl text-[#C62828] hover:opacity-80 transition-opacity min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C62828] focus-visible:ring-offset-2 rounded-sm"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    <PhoneIcon className="w-[18px] h-[18px]" />
                    (301) 578-8779
                  </a>
                  <p className="text-xs text-[#555555] dark:text-[#A0A0A0] mt-1">
                    {t('sidebar.callHours')}
                  </p>
                </div>

                {/* Card 2 — Location & Hours */}
                <div className="rounded-2xl bg-white dark:bg-[#252525] border border-[#CCCCCC] dark:border-[#333333] p-5 space-y-3.5">
                  <div className="flex items-start gap-2.5">
                    <LocationIcon className="w-4 h-4 text-[#C62828] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[#2D2D2D] dark:text-[#E0E0E0]">
                        {t('sidebar.addressLine1')}
                      </p>
                      <p className="text-xs text-[#555555] dark:text-[#A0A0A0]">
                        {t('sidebar.addressLine2')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <ClockIcon className="w-4 h-4 text-[#C62828] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[#2D2D2D] dark:text-[#E0E0E0]">
                        {t('sidebar.hoursWeekday')}
                      </p>
                      <p className="text-xs text-[#555555] dark:text-[#A0A0A0]">
                        {t('sidebar.hoursSaturday')}
                      </p>
                      <p className="text-xs text-[#555555] dark:text-[#A0A0A0]">
                        {t('sidebar.hoursSunday')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 3 — Why choose us */}
                <div className="rounded-2xl bg-white dark:bg-[#252525] border border-[#CCCCCC] dark:border-[#333333] p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#555555] dark:text-[#A0A0A0] mb-3">
                    {t('sidebar.whyChooseLabel')}
                  </p>
                  <ul className="space-y-2.5">
                    {whyChoose.map(({ key, Icon }) => (
                      <li key={key} className="flex items-center gap-2.5">
                        <Icon className="w-[18px] h-[18px] text-[#C62828] flex-shrink-0" />
                        <span className="text-sm text-[#2D2D2D] dark:text-[#E0E0E0]">
                          {t(`sidebar.whyChoose.${key}`)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            }
          />
        </div>

        {/* ─────────────── Section D — Social Proof Strip ─────────────── */}
        <section
          className="bg-gray-50 dark:bg-[#1E1E1E] border-y border-[#CCCCCC] dark:border-[#333333] py-12 lg:py-14"
          aria-label="Trust indicators"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:divide-x sm:divide-[#CCCCCC] dark:sm:divide-[#333333]">
              {/* Column 1 — Google rating */}
              <div className="flex flex-col items-center text-center gap-2 sm:px-8 sm:first:pl-0 sm:last:pr-0">
                <div
                  className="flex items-center gap-1 text-[#C62828]"
                  aria-hidden="true"
                >
                  {[0, 1, 2, 3, 4].map((i) => (
                    <StarIcon key={i} className="w-5 h-5" />
                  ))}
                </div>
                <p
                  className="font-extrabold text-3xl text-[#2D2D2D] dark:text-[#E0E0E0] leading-none"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {ratingDisplay}
                </p>
                <p className="text-sm text-[#555555] dark:text-[#A0A0A0]">
                  {t('socialProof.ratingLabelPrefix')} {reviewCount}{' '}
                  {t('socialProof.ratingLabelSuffix')}
                </p>
                <a
                  href="https://www.google.com/maps/place/Prestige+Auto+Body+Inc./"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center min-h-[44px] px-2 text-xs text-[#C62828] underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C62828] focus-visible:ring-offset-2 rounded-sm"
                >
                  {t('socialProof.readReviews')}
                </a>
              </div>

              {/* Column 2 — Insurance fallback badges */}
              <div className="flex flex-col items-center text-center gap-3 sm:px-8 sm:first:pl-0 sm:last:pr-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#555555] dark:text-[#A0A0A0]">
                  {t('socialProof.insuranceLabel')}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {INSURERS.map((key) => (
                    <span
                      key={key}
                      className="px-2.5 py-1 rounded-md border border-[#CCCCCC] dark:border-[#333333] bg-white dark:bg-[#252525] text-xs font-medium text-[#555555] dark:text-[#A0A0A0]"
                    >
                      {t(`socialProof.insurers.${key}`)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Column 3 — I-CAR */}
              <div className="flex flex-col items-center text-center gap-2 sm:px-8 sm:first:pl-0 sm:last:pr-0">
                <Image
                  src="/gold_class_icar_logo.png"
                  alt={t('socialProof.icarImageAlt')}
                  width={140}
                  height={72}
                  className="h-[72px] w-auto object-contain"
                />
                <p className="text-sm text-[#555555] dark:text-[#A0A0A0]">
                  {t('socialProof.icarLabel')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('socialProof.icarSubLabel')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────── Section E — FAQ ─────────────── */}
        <section
          className="bg-white dark:bg-[#121212] py-14 lg:py-16"
          aria-labelledby="faq-heading"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2
              id="faq-heading"
              className="font-bold text-3xl text-[#2D2D2D] dark:text-[#E0E0E0] mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('faq.heading')}
            </h2>
            <p className="text-sm text-[#555555] dark:text-[#A0A0A0] mb-8">
              {t('faq.subheading')}
            </p>

            <div>
              {FAQ_KEYS.map((key) => (
                <details
                  key={key}
                  className="group border-b border-[#CCCCCC] dark:border-[#333333]"
                >
                  <summary className="flex justify-between items-center gap-4 py-4 cursor-pointer list-none font-semibold text-sm text-[#2D2D2D] dark:text-[#E0E0E0] hover:text-[#C62828] transition-colors duration-150 focus-visible:outline-none focus-visible:text-[#C62828] [&::-webkit-details-marker]:hidden">
                    <span>{t(`faq.items.${key}.question`)}</span>
                    <svg
                      className="w-4 h-4 text-[#C62828] flex-shrink-0 transition-transform duration-200 group-open:rotate-90"
                      fill="none"
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path
                        d="M6 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </summary>
                  <div className="pb-4 text-sm text-[#555555] dark:text-[#A0A0A0] leading-relaxed">
                    {t(`faq.items.${key}.answer`)}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
