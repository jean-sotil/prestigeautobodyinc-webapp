import type { Metadata } from 'next';
import Image from 'next/image';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { BASE_URL } from '@/lib/seo';
import { StatsCounters, ResponsiveHero } from '@/components/hero';
import { getHeroMedia, pickAlt } from '@/lib/heroMedia';
import { GoogleReviews } from '@/components/embeds/GoogleReviews';
import { ReviewsJsonLd, LocalBusinessJsonLd } from '@/components/seo';
import { getBusinessRating } from '@/lib/google-places';
import LazyYouTubeEmbed from '@/components/dynamic/LazyYouTubeEmbed';
import LazyQuoteForm from '@/components/dynamic/LazyQuoteForm';
import { ButtonLink } from '@/components/ui/Button';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import {
  CollisionIcon,
  WrenchIcon,
  PaintbrushIcon,
  ShieldIcon,
  CheckCircleIcon,
  ClockIcon,
  AwardIcon,
  ToolsIcon,
  ThumbsUpIcon,
} from '@/components/ui/Icons';

const OG_IMAGE = '/hero/homepage/desktop/homepage-hero-desktop.webp';

interface HomeMessagesType {
  metadata?: { title?: string; description?: string };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await getMessages({ locale })) as HomeMessagesType;

  const title = messages.metadata?.title || 'Prestige Auto Body Inc.';
  const description =
    messages.metadata?.description ||
    'Professional auto body repair, collision repair, and painting services in Silver Spring, MD.';
  const ogLocale = locale === 'es' ? 'es_US' : 'en_US';

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        en: `${BASE_URL}/en`,
        es: `${BASE_URL}/es`,
        'x-default': `${BASE_URL}/en`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}`,
      locale: ogLocale,
      alternateLocale: locale === 'en' ? 'es_US' : 'en_US',
      type: 'website',
      images: [{ url: OG_IMAGE, width: 1920, height: 1080, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

const WHY_CHOOSE_KEYS = [
  'experience',
  'certified',
  'warranty',
  'insurance',
  'equipment',
  'estimates',
] as const;

const WHY_CHOOSE_ICONS: Record<
  (typeof WHY_CHOOSE_KEYS)[number],
  typeof CheckCircleIcon
> = {
  experience: ClockIcon,
  certified: AwardIcon,
  warranty: ShieldIcon,
  insurance: CheckCircleIcon,
  equipment: ToolsIcon,
  estimates: ThumbsUpIcon,
};

export default async function HomePage() {
  const [t, common, rating, heroMedia, locale, overlines] = await Promise.all([
    getTranslations('home'),
    getTranslations('common'),
    getBusinessRating(),
    getHeroMedia('homepage'),
    getLocale(),
    getTranslations('overlines'),
  ]);

  return (
    <div className="font-sans min-h-screen">
      <LocalBusinessJsonLd
        ratingValue={rating.ratingValue}
        reviewCount={rating.reviewCount}
        locale={locale}
      />
      {/* Hero Section — full-bleed image with dark overlay, white text */}
      <section
        className="bg-foreground relative w-full min-h-105 sm:min-h-120 lg:min-h-135 overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* Full-bleed edge-to-edge background image with subtle Ken Burns */}
        <div className="absolute inset-0 w-full h-full motion-safe:animate-ken-burns">
          <ResponsiveHero
            slug="homepage"
            alt={pickAlt(heroMedia, locale, t('pageHero.alt'))}
            title={t('pageHero.imgTitle')}
            media={heroMedia}
            className="h-full"
          />
        </div>
        {/* Directional gradient overlay — dark-to-red-tint across the width */}
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.65) 45%, var(--color-red-surface) 75%, transparent 100%)',
          }}
        />

        {/* Content overlay — white text on dark hero */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 flex items-center">
          <div className="flex flex-col gap-4 w-full lg:w-135 shrink-0">
            <h1
              id="hero-heading"
              className="font-display font-extrabold text-white text-3xl md:text-5xl leading-tight tracking-display max-w-[480px] drop-shadow-lg motion-safe:animate-slide-in-left motion-safe:delay-200"
            >
              {t('pageHero.h1')}
            </h1>
            <p className="text-white/80 text-base leading-relaxed motion-safe:animate-slide-in-left motion-safe:delay-[350ms]">
              {t('pageHero.subtitle')}
            </p>
            <div className="flex flex-col gap-4 motion-safe:animate-slide-in-left motion-safe:delay-500">
              <p className="font-bold text-sm text-white leading-normal">
                {t('pageHero.estimatePrompt')}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                <ButtonLink
                  href="/get-a-quote"
                  variant="primary"
                  size="lg"
                  className="text-sm min-w-40 whitespace-nowrap"
                >
                  {t('pageHero.ctaButton')}
                </ButtonLink>
              </div>
              {/* See our work — video/gallery link */}
              <Link
                href="/gallery"
                className="group inline-flex items-center gap-2 w-fit rounded-md px-1 py-0.5 -ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0 transition-colors duration-150 group-hover:bg-red-pressed">
                  <svg
                    className="h-3 w-3 ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span className="flex flex-col leading-normal text-sm">
                  <span className="font-bold text-red-hover">
                    {t('pageHero.seeLabel')}
                  </span>
                  <span className="text-white/90">
                    {t('pageHero.ourWorkLabel')}
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <StatsCounters
        ratingValue={rating.ratingValue}
        reviewCount={rating.reviewCount}
      />

      {/* Our Services Section */}
      <section
        className="relative py-16 bg-[#2D2D2D] dark:bg-[#1E1E1E] z-0"
        aria-labelledby="services-heading"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg bg-blend-difference bg-primary/15"
          style={{ backgroundImage: "url('./car-repair-maintenance.avif')" }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceCard
              icon={<CollisionIcon className="w-6 h-6" aria-hidden="true" />}
              title={t('services.collision.title')}
              description={t('services.collision.description')}
              href="/collision-repair"
              linkLabel={common('learnMore')}
            />
            <ServiceCard
              icon={<WrenchIcon className="w-6 h-6" aria-hidden="true" />}
              title={t('services.autoBody.title')}
              description={t('services.autoBody.description')}
              href="/auto-body-services"
              linkLabel={common('learnMore')}
            />
            <ServiceCard
              icon={<PaintbrushIcon className="w-6 h-6" aria-hidden="true" />}
              title={t('services.painting.title')}
              description={t('services.painting.description')}
              href="/auto-painting"
              linkLabel={common('learnMore')}
            />
            <ServiceCard
              icon={<ShieldIcon className="w-6 h-6" aria-hidden="true" />}
              title={t('services.insurance.title')}
              description={t('services.insurance.description')}
              href="/insurance-claims"
              linkLabel={common('learnMore')}
            />
          </div>
        </div>
      </section>

      {/* Why Choose Prestige Section - 2 column: bullets + YouTube */}
      <section className="py-16" aria-labelledby="why-choose-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 items-center">
          {/* Left: Bullets */}
          <div className="flex-1 flex flex-col gap-4 max-w-120">
            <SectionHeading
              id="why-choose-heading"
              overline={overlines('whyUs')}
              heading={t('whyChooseUs.title')}
            />
            {WHY_CHOOSE_KEYS.map((key) => {
              const Icon = WHY_CHOOSE_ICONS[key];
              return (
                <div key={key} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-surface border border-red-border text-red-hover flex-shrink-0">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span className="text-foreground text-sm">
                    {t(`whyChooseUsBullets.${key}`)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right: YouTube Embed */}
          <div className="flex-1 w-full max-w-[520px]">
            <LazyYouTubeEmbed
              videoId="8DM-Ej56Xf8"
              title={t('video.playButton')}
            />
          </div>
        </div>
      </section>

      {/* Get Your Free Quote Section */}
      <section className="z-0 py-16" aria-labelledby="free-estimate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 items-center">
          <LazyQuoteForm />
        </div>
      </section>

      {/* Limited Lifetime Warranty Section */}
      <section
        className="relative py-16 md:py-20 overflow-hidden"
        aria-labelledby="warranty-heading"
      >
        {/* Steel texture background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/steel-texture.jpg')" }}
        />
        <div className="absolute inset-0 bg-foreground/90 dark:bg-black/90" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Left: Certification badges */}
            <div className="shrink-0 flex items-center gap-6 sm:gap-8">
              <Image
                src="/LIfetime-Guarantee-new.png"
                alt={t('warranty.badgeAlt')}
                width={200}
                height={200}
                className="w-[120px] h-[120px] md:w-40 md:h-40drop-shadow-[0_0_24px_rgba(198,40,40,0.3)]"
              />
              <Image
                src="/gold_class_icar_logo.png"
                alt={t('warranty.icarAlt')}
                width={200}
                height={200}
                className="w-[120px] h-[120px] md:w-40 md:h-40 drop-shadow-[0_0_24px_rgba(200,180,80,0.25)]"
              />
              <Image
                src="/saint_pci_tested_logo.png"
                alt={t('warranty.saintAlt')}
                width={200}
                height={200}
                className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] drop-shadow-[0_0_24px_rgba(50,120,220,0.25)]"
              />
            </div>

            {/* Right: Content */}
            <div className="flex flex-col gap-5 text-center lg:text-left">
              <SectionHeading
                id="warranty-heading"
                overline={overlines('warranty')}
                heading={t('warranty.title')}
                tone="inverted"
              />

              <p className="text-lg font-semibold text-white">
                {t('warranty.subtitle')}
              </p>

              <div className="flex flex-col gap-3">
                {(['bullet1', 'bullet2', 'bullet3'] as const).map((key) => (
                  <div
                    key={key}
                    className="flex items-center gap-3 justify-center lg:justify-start"
                  >
                    <CheckCircleIcon
                      size={20}
                      className="shrink-0 text-primary"
                      ariaLabel=""
                    />
                    <span className="text-sm text-white/80">
                      {t(`warranty.${key}`)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-2">
                <ButtonLink
                  href="/get-a-quote"
                  variant="primary"
                  size="lg"
                  className="rounded-full shadow-lg"
                >
                  {t('warranty.cta')}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section
        className="py-16 bg-[#F5F5F5] dark:bg-[#1E1E1E]"
        aria-labelledby="testimonials-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6">
          <SectionHeading
            id="testimonials-heading"
            overline={overlines('testimonials')}
            heading={t('testimonials.title')}
            centered
          />
          <p className="text-(--text-secondary) text-sm text-center">
            {t('testimonials.subtitle')}
          </p>
          <ReviewsJsonLd
            ratingValue={rating.ratingValue}
            reviewCount={rating.reviewCount}
          />
          <GoogleReviews />
        </div>
      </section>

      {/* CTA Banner */}
      <section
        className="bg-[#c62828] py-16 text-white"
        aria-labelledby="cta-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-4 text-center">
          <h2
            id="cta-heading"
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('cta.title')}
          </h2>
          <p className="text-[#ffe0e0] text-base">{t('cta.description')}</p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <ButtonLink href="/get-a-quote" variant="inverted" size="lg">
              {t('cta.button')}
            </ButtonLink>
            <ButtonLink
              href="tel:3015788779"
              variant="outline-white"
              size="lg"
              aria-label={t('cta.phoneAriaLabel')}
            >
              {t('cta.phone')}
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
