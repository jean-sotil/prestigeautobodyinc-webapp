import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { ServicePageTemplate, ServiceJsonLd } from '@/components/services';
import { getHeroMedia, pickAlt } from '@/lib/heroMedia';

const SERVICE_KEY = 'collisionRepair';

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
      canonical: `https://prestigeautobodyinc.com/${locale}/collision-repair`,
    },
  };
}

export default async function CollisionRepairPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, heroMedia] = await Promise.all([
    getTranslations({ locale, namespace: 'services' }),
    getHeroMedia('collision-repair'),
  ]);

  return (
    <>
      <ServiceJsonLd
        serviceName="Collision Repair"
        description={t(`pages.${SERVICE_KEY}.metaDescription`)}
        url="https://prestigeautobodyinc.com/en/collision-repair"
      />
      <ServicePageTemplate
        serviceKey={SERVICE_KEY}
        heroSlug="collision-repair"
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
