import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BASE_URL } from '@/lib/seo';
import { PageHeroBanner } from '@/components/hero';
import { getMediaByFilename, pickAlt } from '@/lib/heroMedia';
import {
  LocalBusinessJsonLd,
  BreadcrumbJsonLd,
  generateBreadcrumbItems,
} from '@/components/seo';
import { getBusinessRating } from '@/lib/google-places';
import { PhoneIcon, LocationIcon, EmailIcon } from '@/components/ui/Icons';
import { BusinessHours } from '@/components/contact/BusinessHours';
import { MapEmbed } from '@/components/contact/MapEmbed';
import { OpenStatus } from '@/components/contact/OpenStatus';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  const title = t('metaTitle');
  const description = t('metaDescription');
  const ogLocale = locale === 'es' ? 'es_US' : 'en_US';
  const OG_IMAGE = '/hero/homepage/desktop/homepage-hero-desktop.webp';
  const enPath = '/en/contact';
  const esPath = '/es/contacto';
  const currentPath = locale === 'es' ? esPath : enPath;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}${currentPath}`,
      languages: {
        en: `${BASE_URL}${enPath}`,
        es: `${BASE_URL}${esPath}`,
        'x-default': `${BASE_URL}${enPath}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}${currentPath}`,
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

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, heroMedia, rating, nav, tFooter] = await Promise.all([
    getTranslations({ locale, namespace: 'contact' }),
    getMediaByFilename(
      'prestige-auto-body-icar-gold-class-certified-collision-repair-silver-spring.jpg',
    ),
    getBusinessRating(),
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'footer' }),
  ]);

  const breadcrumbItems = generateBreadcrumbItems(
    nav('contact'),
    `/${locale}/contact`,
    nav('home'),
    locale,
  );

  const phoneDisplay = tFooter('company.phone');
  const phoneRaw = phoneDisplay.replace(/\D/g, '');
  const addressLine1 = tFooter('company.address');
  const addressLine2 = tFooter('company.address2');
  const fullAddress = `${addressLine1}, ${addressLine2}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    fullAddress,
  )}`;

  return (
    <div className="font-sans min-h-screen">
      <LocalBusinessJsonLd
        ratingValue={rating.ratingValue}
        reviewCount={rating.reviewCount}
        locale={locale}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} locale={locale} />
      <PageHeroBanner
        slug="homepage"
        alt={pickAlt(heroMedia, locale, t('heroImageAlt'))}
        title={t('heroTitle')}
        heading={t('heading')}
        subtitle={t('subtitle')}
        media={heroMedia}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div aria-hidden className="mb-6 flex items-center gap-1.5">
          <span className="block h-0.5 w-8 bg-primary" />
          <span className="block h-0.5 w-14 bg-primary" />
          <span className="block h-0.5 w-3 bg-primary" />
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <OpenStatus locale={locale} />
          {rating.ratingValue > 0 && (
            <span className="inline-flex items-center gap-1.5 text-foreground">
              <span
                aria-hidden
                className="text-base leading-none text-(--color-gold-badge)"
              >
                ★
              </span>
              <span className="text-muted-foreground">
                {t('reviews.ratingShort', {
                  rating: rating.ratingValue.toFixed(1),
                  count: String(rating.reviewCount),
                })}
              </span>
            </span>
          )}
        </div>

        <div className="mb-14 grid grid-cols-1 gap-3 animate-fade-in-up sm:grid-cols-2">
          <a
            href={`tel:${phoneRaw}`}
            aria-label={t('actions.callAriaLabel', { phone: phoneDisplay })}
            className="group flex items-center gap-4 rounded-xl bg-primary px-6 py-5 text-primary-foreground transition hover:bg-(--color-red-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <PhoneIcon size={28} ariaLabel="" className="shrink-0" />
            <span className="flex flex-col items-start leading-tight">
              <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] opacity-90">
                {t('actions.callTheShop')}
              </span>
              <span className="text-2xl font-bold tabular-nums">
                {phoneDisplay}
              </span>
            </span>
          </a>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('actions.directionsAriaLabel', {
              address: fullAddress,
            })}
            className="group flex items-center gap-4 rounded-xl border-2 border-foreground/15 bg-background px-6 py-5 text-foreground transition hover:border-foreground/40 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <LocationIcon size={28} ariaLabel="" className="shrink-0" />
            <span className="flex flex-col items-start leading-tight">
              <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {t('actions.getDirections')}
              </span>
              <span className="text-base font-semibold">{addressLine1}</span>
            </span>
          </a>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
          <BusinessHours locale={locale} />

          <div>
            <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
              <LocationIcon
                size={22}
                ariaLabel=""
                className="text-muted-foreground"
              />
              {t('body.visitUsTitle')}
            </h2>
            <address className="space-y-4 not-italic">
              <p className="leading-relaxed text-foreground">
                <span className="block">{addressLine1}</span>
                <span className="block">{addressLine2}</span>
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <a
                  href={`tel:${phoneRaw}`}
                  className="inline-flex w-fit items-center gap-2 rounded-sm text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <PhoneIcon
                    size={16}
                    ariaLabel=""
                    className="text-muted-foreground"
                  />
                  <span className="tabular-nums">{phoneDisplay}</span>
                </a>
                <a
                  href={`mailto:${tFooter('company.email')}`}
                  className="inline-flex w-fit items-center gap-2 rounded-sm text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <EmailIcon
                    size={16}
                    ariaLabel=""
                    className="text-muted-foreground"
                  />
                  <span>{tFooter('company.email')}</span>
                </a>
              </div>
            </address>
          </div>
        </div>
      </section>

      <MapEmbed
        query={fullAddress}
        title={tFooter('findUs.mapTitle')}
        openInMapsLabel={t('actions.openInMaps')}
      />
    </div>
  );
}
