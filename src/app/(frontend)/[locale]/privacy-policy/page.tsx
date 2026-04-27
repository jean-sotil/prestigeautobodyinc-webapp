import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BASE_URL } from '@/lib/seo';
import { LegalPage } from '@/components/legal/LegalPage';
import { BreadcrumbJsonLd, generateBreadcrumbItems } from '@/components/seo';

const SECTION_KEYS = [
  'informationCollected',
  'howWeUse',
  'thirdParties',
  'cookies',
  'retention',
  'rights',
  'childrensPrivacy',
  'security',
  'changes',
  'contact',
  'governingLaw',
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
  const t = await getTranslations({ locale, namespace: 'privacyPolicy' });

  const enPath = '/en/privacy-policy';
  const esPath = '/es/politica-de-privacidad';
  const currentPath = locale === 'es' ? esPath : enPath;

  const ogImage = '/og-image.jpg';

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `${BASE_URL}${currentPath}`,
      languages: {
        en: `${BASE_URL}${enPath}`,
        es: `${BASE_URL}${esPath}`,
        'x-default': `${BASE_URL}${enPath}`,
      },
    },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: `${BASE_URL}${currentPath}`,
      locale: locale === 'es' ? 'es_US' : 'en_US',
      alternateLocale: locale === 'en' ? 'es_US' : 'en_US',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: t('metaTitle') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metaTitle'),
      description: t('metaDescription'),
      images: [ogImage],
    },
  };
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });

  const breadcrumbItems = generateBreadcrumbItems(
    t('privacyPolicy') || 'Privacy Policy',
    `/${locale}/privacy-policy`,
    t('home'),
    locale,
  );

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} locale={locale} />
      <LegalPage
        namespace="privacyPolicy"
        sectionKeys={SECTION_KEYS}
        locale={locale}
      />
    </>
  );
}
