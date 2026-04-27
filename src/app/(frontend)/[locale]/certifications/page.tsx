import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BreadcrumbJsonLd, generateBreadcrumbItems } from '@/components/seo';

const BASE_URL = 'https://www.prestigeautobodyinc.com';
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
  const title = locale === 'es'
    ? 'Certificaciones I-CAR y ASE | Prestige Auto Body Inc.'
    : 'I-CAR & ASE Certifications | Prestige Auto Body Inc.';
  const description = locale === 'es'
    ? 'Nuestros técnicos poseen certificaciones I-CAR y ASE, garantizando reparaciones profesionales según los estándares de la industria.'
    : 'Our technicians hold I-CAR and ASE certifications, ensuring professional repairs that follow industry best practices and safety standards.';
  const ogLocale = locale === 'es' ? 'es_US' : 'en_US';
  const enPath = '/en/certifications';
  const esPath = '/es/certificaciones';
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

export default async function CertificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('nav');

  const breadcrumbItems = generateBreadcrumbItems(
    t('certifications'),
    `/${locale}/certifications`,
    t('home'),
    locale,
  );

  return (
    <div className="font-sans min-h-screen">
      <BreadcrumbJsonLd items={breadcrumbItems} locale={locale} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6">{t('certifications')}</h1>
        <p className="text-lg text-gray-600">
          Our technicians hold I-CAR and ASE certifications, ensuring that your
          vehicle is repaired by qualified professionals who follow industry
          best practices and safety standards.
        </p>
      </main>
    </div>
  );
}
