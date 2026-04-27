import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BASE_URL } from '@/lib/seo';
import { ServicePageTemplate, ServiceJsonLd } from '@/components/services';
import { getHeroMedia, pickAlt } from '@/lib/heroMedia';
import { BreadcrumbJsonLd, generateBreadcrumbItems } from '@/components/seo';

const SERVICE_KEY = 'autoPainting';

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

  const title = t(`pages.${SERVICE_KEY}.metaTitle`);
  const description = t(`pages.${SERVICE_KEY}.metaDescription`);
  const ogLocale = locale === 'es' ? 'es_US' : 'en_US';
  const OG_IMAGE = '/hero/homepage/desktop/homepage-hero-desktop.webp';
  const enPath = '/en/auto-painting';
  const esPath = '/es/pintura-de-autos';
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

export default async function AutoPaintingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, heroMedia, nav] = await Promise.all([
    getTranslations({ locale, namespace: 'services' }),
    getHeroMedia('paint-solutions'),
    getTranslations({ locale, namespace: 'nav' }),
  ]);

  const breadcrumbItems = generateBreadcrumbItems(
    nav('autoPainting'),
    `/${locale}/auto-painting`,
    nav('home'),
    locale,
  );

  return (
    <>
      <ServiceJsonLd
        serviceName="Auto Painting"
        description={t(`pages.${SERVICE_KEY}.metaDescription`)}
        url={`https://prestigeautobodyinc.com/${locale}/auto-painting`}
        serviceType="Auto Painting"
        locale={locale}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} locale={locale} />
      <ServicePageTemplate
        serviceKey={SERVICE_KEY}
        heroSlug="paint-solutions"
        heroMedia={heroMedia}
        heroAlt={pickAlt(
          heroMedia,
          locale,
          t(`pages.${SERVICE_KEY}.heroImageAlt`),
        )}
      />
    </>
  );
}
