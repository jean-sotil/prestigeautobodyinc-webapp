import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { LegalPage } from '@/components/legal/LegalPage';

const BASE_URL = 'https://www.prestigeautobodyinc.com';

const SECTION_KEYS = [
  'acceptance',
  'useOfWebsite',
  'quoteRequests',
  'userSubmissions',
  'intellectualProperty',
  'thirdPartyLinks',
  'disclaimers',
  'limitation',
  'indemnification',
  'termination',
  'changes',
  'governingLaw',
  'contact',
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
  const t = await getTranslations({ locale, namespace: 'termsOfService' });

  const enPath = '/en/terms-of-service';
  const esPath = '/es/terminos-de-servicio';
  const currentPath = locale === 'es' ? esPath : enPath;

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `${BASE_URL}${currentPath}`,
      languages: {
        en: `${BASE_URL}${enPath}`,
        es: `${BASE_URL}${esPath}`,
      },
    },
  };
}

export default async function TermsOfServicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <LegalPage
      namespace="termsOfService"
      sectionKeys={SECTION_KEYS}
      locale={locale}
    />
  );
}
