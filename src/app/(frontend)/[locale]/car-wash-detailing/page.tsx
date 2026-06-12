import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BASE_URL } from '@/lib/seo';
import { getPathname } from '@/i18n/navigation';
import { BreadcrumbJsonLd, generateBreadcrumbItems } from '@/components/seo';
import { ServiceJsonLd } from '@/components/services';
import { getMediaByFilename, pickAlt } from '@/lib/heroMedia';
import { CarWashServicePage } from '@/components/car-wash/CarWashServicePage';

const PATHNAME = '/car-wash-detailing' as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const OG_IMAGE =
  'https://ozvvbnwhcfpq2umh.public.blob.vercel-storage.com/hero_banner-1024x434.png';

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
      images: [{ url: OG_IMAGE, width: 1024, height: 434, alt: title }],
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
  const [nav, t, heroMedia] = await Promise.all([
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'carWash' }),
    getMediaByFilename('hero_banner.png'),
  ]);

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
        serviceType={['Car Wash', 'Auto Detailing', 'Ceramic Coating']}
        schemaType="AutoWash"
        showAggregateRating
        offerCatalog={[
          {
            name: 'Basic Hand Wash',
            description:
              'Professional hand wash, vacuum, tire shine, and window cleaning. Available for cars, SUVs, and vans.',
            minPrice: 40,
            maxPrice: 80,
          },
          {
            name: 'Full Car Detail',
            description:
              'Complete interior and exterior detailing with steam cleaning, UV protectant, and high-lubricity wax.',
            minPrice: 175,
            maxPrice: 250,
          },
          {
            name: 'Ceramic Coat',
            description:
              'Premium ceramic coating with full paint correction, polishing, and 2-day indoor curing process.',
            minPrice: 1400,
            maxPrice: 2200,
          },
        ]}
        locale={locale}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} locale={locale} />
      <CarWashServicePage
        locale={locale}
        heroMedia={heroMedia}
        heroAlt={pickAlt(heroMedia, locale, t('hero.imageAlt'))}
      />
    </>
  );
}
