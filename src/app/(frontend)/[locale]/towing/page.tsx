import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BASE_URL } from '@/lib/seo';
import { PageHeroBanner } from '@/components/hero';
import { getHeroMedia, pickAlt } from '@/lib/heroMedia';
import { BreadcrumbJsonLd, generateBreadcrumbItems } from '@/components/seo';
import { ServiceJsonLd } from '@/components/services';

const FALLBACK_ALT =
  'Professional flatbed tow truck providing 24/7 emergency roadside assistance and towing services at night with amber emergency lights';

const OG_IMAGE = '/hero/homepage/desktop/homepage-hero-desktop.webp';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services' });
  const title =
    locale === 'es'
      ? 'Servicio de Remolque 24/7 | Prestige Auto Body Inc.'
      : '24/7 Towing & Roadside Assistance | Prestige Auto Body Inc.';
  const description =
    locale === 'es'
      ? 'Servicio de remolque de emergencia disponible las 24 horas en Silver Spring, MD y áreas circundantes.'
      : 'Emergency towing services available 24 hours a day, 7 days a week in Silver Spring, MD and surrounding areas.';
  const ogLocale = locale === 'es' ? 'es_US' : 'en_US';
  const enPath = '/en/towing';
  const esPath = '/es/remolque';
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

export default async function TowingPage() {
  const [heroMedia, locale, nav, t] = await Promise.all([
    getHeroMedia('towing-24-7'),
    getLocale(),
    getTranslations('nav'),
    getTranslations('services'),
  ]);

  const breadcrumbItems = generateBreadcrumbItems(
    nav('towing'),
    `/${locale}/towing`,
    nav('home'),
    locale,
  );

  return (
    <div className="font-sans min-h-screen">
      <ServiceJsonLd
        serviceName="24/7 Towing Service"
        description="Emergency towing services available 24 hours a day, 7 days a week in Silver Spring, MD and surrounding areas"
        url={`https://prestigeautobodyinc.com/${locale}/towing`}
        serviceType="Towing Service"
        locale={locale}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} locale={locale} />
      <PageHeroBanner
        slug="towing-24-7"
        alt={pickAlt(heroMedia, locale, FALLBACK_ALT)}
        title="24/7 Emergency Towing & Roadside Assistance in Silver Spring, MD"
        heading="24/7 Towing"
        subtitle="Emergency towing services available when you need us most"
        media={heroMedia}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-lg text-(--text-secondary) leading-relaxed">
          Our professional tow truck operators are ready to assist you around
          the clock, ensuring your vehicle is safely transported to our
          facility. Available 24 hours a day, 7 days a week.
        </p>
      </main>
    </div>
  );
}
