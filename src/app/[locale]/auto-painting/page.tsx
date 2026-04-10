import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { ServicePageTemplate, ServiceJsonLd } from '@/components/services';

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

  return {
    title: t(`pages.${SERVICE_KEY}.metaTitle`),
    description: t(`pages.${SERVICE_KEY}.metaDescription`),
    alternates: {
      canonical: `https://prestigeautobodyinc.com/${locale}/auto-painting`,
    },
  };
}

export default async function AutoPaintingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services' });

  return (
    <>
      <ServiceJsonLd
        serviceName="Auto Painting"
        description={t(`pages.${SERVICE_KEY}.metaDescription`)}
        url="https://prestigeautobodyinc.com/en/auto-painting"
      />
      <ServicePageTemplate
        serviceKey={SERVICE_KEY}
        heroSlug="paint-solutions"
      />
    </>
  );
}
