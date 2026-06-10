import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BASE_URL } from '@/lib/seo';
import { getPathname } from '@/i18n/navigation';
import { BreadcrumbJsonLd, generateBreadcrumbItems } from '@/components/seo';
import { ServiceJsonLd } from '@/components/services';
import { CarWashServicePage } from '@/components/car-wash/CarWashServicePage';

const PATHNAME = '/car-wash-detailing' as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const OG_IMAGE = '/hero/homepage/desktop/homepage-hero-desktop.webp';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'carWash' });

  const title = t('meta.title');
  const description = t('meta.description');
  const ogLocale = locale === 'es' ? 'es_US' : 'en_US';
  const currentPath = getPathname({
    locale: locale as 'en' | 'es',
    href: PATHNAME,
  });
  const enPath = getPathname({ locale: 'en', href: PATHNAME });
  const esPath = getPathname({ locale: 'es', href: PATHNAME });

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

export default async function CarWashDetailingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const nav = await getTranslations({ locale, namespace: 'nav' });
  const t = await getTranslations({ locale, namespace: 'carWash' });

  const localizedPath = getPathname({
    locale: locale as 'en' | 'es',
    href: PATHNAME,
  });

  const breadcrumbItems = generateBreadcrumbItems(
    nav('carWashDetailing'),
    localizedPath,
    nav('home'),
    locale,
  );

  return (
    <>
      <ServiceJsonLd
        serviceName="Hand Wash & Detailing Services"
        description={t('meta.description')}
        url={`https://prestigeautobodyinc.com${localizedPath}`}
        serviceType="Car Wash and Detailing"
        locale={locale}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} locale={locale} />
      <CarWashServicePage locale={locale} />
    </>
  );
}
