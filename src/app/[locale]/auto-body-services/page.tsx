import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { ServicePageTemplate, ServiceJsonLd } from '@/components/services';
import { getHeroMedia, pickAlt } from '@/lib/heroMedia';

const SERVICE_KEY = 'autoBodyServices';

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
      canonical: `https://prestigeautobodyinc.com/${locale}/auto-body-services`,
    },
  };
}

export default async function AutoBodyServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, heroMedia] = await Promise.all([
    getTranslations({ locale, namespace: 'services' }),
    getHeroMedia('auto-body-services'),
  ]);

  return (
    <>
      <ServiceJsonLd
        serviceName="Auto Body Work Services"
        description={t(`pages.${SERVICE_KEY}.metaDescription`)}
        url="https://prestigeautobodyinc.com/en/auto-body-services"
      />
      <ServicePageTemplate
        serviceKey={SERVICE_KEY}
        heroSlug="auto-body-services"
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
