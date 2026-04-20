import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { ServicePageTemplate, ServiceJsonLd } from '@/components/services';
import { getHeroMedia } from '@/lib/heroMedia';

const SERVICE_KEY = 'insuranceClaims';

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
      canonical: `https://prestigeautobodyinc.com/${locale}/insurance-claims`,
    },
  };
}

export default async function InsuranceClaimsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, heroMedia] = await Promise.all([
    getTranslations({ locale, namespace: 'services' }),
    getHeroMedia('insurance-claims'),
  ]);

  return (
    <>
      <ServiceJsonLd
        serviceName="Insurance Claims Assistance"
        description={t(`pages.${SERVICE_KEY}.metaDescription`)}
        url="https://prestigeautobodyinc.com/en/insurance-claims"
      />
      <ServicePageTemplate
        serviceKey={SERVICE_KEY}
        heroSlug="insurance-claims"
        heroMedia={heroMedia}
      />
    </>
  );
}
