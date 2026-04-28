import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BASE_URL } from '@/lib/seo';
import { BreadcrumbJsonLd, generateBreadcrumbItems } from '@/components/seo';

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
  const title =
    locale === 'es'
      ? 'Ubicaciones | Prestige Auto Body Inc.'
      : 'Our Locations | Prestige Auto Body Inc.';
  const description =
    locale === 'es'
      ? 'Visite nuestras instalaciones equipadas con tecnología de punta para todas sus necesidades de reparación de carrocería en Silver Spring, MD.'
      : 'Visit our state-of-the-art facility in Silver Spring, MD equipped to handle all your auto body repair needs.';
  const ogLocale = locale === 'es' ? 'es_US' : 'en_US';
  const enPath = '/en/locations';
  const esPath = '/es/ubicaciones';
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

export default async function LocationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('nav');

  const breadcrumbItems = generateBreadcrumbItems(
    t('locations'),
    `/${locale}/locations`,
    t('home'),
    locale,
  );

  return (
    <div className="font-sans min-h-screen">
      <BreadcrumbJsonLd items={breadcrumbItems} locale={locale} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6">{t('locations')}</h1>
        <p className="text-lg text-muted-foreground">
          Visit one of our convenient locations. Our main facility is equipped
          with state-of-the-art equipment to handle all your auto body repair
          needs.
        </p>
      </section>
    </div>
  );
}
