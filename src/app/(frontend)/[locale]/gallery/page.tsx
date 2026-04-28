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
      ? 'Galería de Trabajos | Prestige Auto Body Inc.'
      : 'Repair Gallery – Before & After | Prestige Auto Body Inc.';
  const description =
    locale === 'es'
      ? 'Explore nuestra galería de fotos antes y después que muestran la calidad de nuestro trabajo en reparación de carrocería.'
      : 'Browse before and after photos showcasing our quality auto body repair workmanship in Silver Spring, MD.';
  const ogLocale = locale === 'es' ? 'es_US' : 'en_US';
  const enPath = '/en/gallery';
  const esPath = '/es/galeria';
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

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('nav');

  const breadcrumbItems = generateBreadcrumbItems(
    t('gallery'),
    `/${locale}/gallery`,
    t('home'),
    locale,
  );

  return (
    <div className="font-sans min-h-screen">
      <BreadcrumbJsonLd items={breadcrumbItems} locale={locale} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6">{t('gallery')}</h1>
        <p className="text-lg text-muted-foreground">
          Browse our gallery of before and after photos showcasing our quality
          workmanship. See the transformations we have made for our satisfied
          customers.
        </p>
      </section>
    </div>
  );
}
