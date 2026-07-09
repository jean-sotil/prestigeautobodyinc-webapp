import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BASE_URL } from '@/lib/seo';
import { getPathname } from '@/i18n/navigation';
import { ServicePageTemplate, ServiceJsonLd } from '@/components/services';
import { getHeroMedia, pickAlt } from '@/lib/heroMedia';
import {
  BreadcrumbJsonLd,
  generateBreadcrumbItems,
  FAQJsonLd,
} from '@/components/seo';

const SERVICE_KEY = 'autoBodyServices';
const PATHNAME = '/auto-body-services' as const;

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
  const t = await getTranslations({ locale, namespace: 'services' });

  const title = t(`pages.${SERVICE_KEY}.metaTitle`);
  const description = t(`pages.${SERVICE_KEY}.metaDescription`);
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

export default async function AutoBodyServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, heroMedia, nav] = await Promise.all([
    getTranslations({ locale, namespace: 'services' }),
    getHeroMedia('auto-body-services'),
    getTranslations({ locale, namespace: 'nav' }),
  ]);

  const localizedPath = getPathname({
    locale: locale as 'en' | 'es',
    href: PATHNAME,
  });

  const breadcrumbItems = generateBreadcrumbItems(
    nav('autoBodyServices'),
    localizedPath,
    nav('home'),
    locale,
  );

  const autoBodyFaqs = [
    {
      question: 'What does an auto body shop repair?',
      answer:
        'Our auto body shop repairs dent damage, structural and frame issues, bumper replacement, alloy wheel restoration, and full collision-related bodywork, restoring your vehicle to pre-accident condition.',
    },
    {
      question: 'How long does an auto body repair take?',
      answer:
        'Most auto body repairs take between 3 and 10 business days depending on the extent of the damage, parts availability, and whether a frame straightening or full repaint is required.',
    },
    {
      question: 'Do you work directly with my insurance company?',
      answer:
        'Yes. We work directly with all major insurance carriers, handle the claims paperwork, and provide detailed estimates so you can choose your own repair shop regardless of your insurer’s recommendation.',
    },
  ];

  return (
    <>
      <ServiceJsonLd
        serviceName="Auto Body Work Services"
        description={t(`pages.${SERVICE_KEY}.metaDescription`)}
        url={`https://prestigeautobodyinc.com${localizedPath}`}
        serviceType="Auto Body Repair"
        showAggregateRating
        locale={locale}
      />
      <FAQJsonLd faqs={autoBodyFaqs} locale={locale} />
      <BreadcrumbJsonLd items={breadcrumbItems} locale={locale} />
      <ServicePageTemplate
        serviceKey={SERVICE_KEY}
        heroSlug="auto-body-services"
        locale={locale}
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
