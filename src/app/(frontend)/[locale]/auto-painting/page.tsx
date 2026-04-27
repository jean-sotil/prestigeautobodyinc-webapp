import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { ServicePageTemplate, ServiceJsonLd } from '@/components/services';
import { getHeroMedia, pickAlt } from '@/lib/heroMedia';
import { BreadcrumbJsonLd, generateBreadcrumbItems } from '@/components/seo';

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
  const [t, heroMedia, nav] = await Promise.all([
    getTranslations({ locale, namespace: 'services' }),
    getHeroMedia('paint-solutions'),
    getTranslations({ locale, namespace: 'nav' }),
  ]);

  const breadcrumbItems = generateBreadcrumbItems(
    nav('autoPainting'),
    `/${locale}/auto-painting`,
    nav('home'),
    locale,
  );

  return (
    <>
      <ServiceJsonLd
        serviceName="Auto Painting"
        description={t(`pages.${SERVICE_KEY}.metaDescription`)}
        url={`https://prestigeautobodyinc.com/${locale}/auto-painting`}
        serviceType="Auto Painting"
        locale={locale}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} locale={locale} />
      <ServicePageTemplate
        serviceKey={SERVICE_KEY}
        heroSlug="paint-solutions"
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
