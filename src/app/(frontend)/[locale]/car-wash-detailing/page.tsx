import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BASE_URL } from '@/lib/seo';
import { getPathname } from '@/i18n/navigation';
import {
  BreadcrumbJsonLd,
  generateBreadcrumbItems,
  FAQJsonLd,
} from '@/components/seo';
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
  const [nav, t, heroMedia, serviceT] = await Promise.all([
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'carWash' }),
    getMediaByFilename('hero_banner.png'),
    getTranslations({ locale, namespace: 'services' }),
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

  const carWashFaqs = [
    {
      question: 'How long does a full car detail take?',
      answer:
        'A complete interior and exterior detail typically takes 3 to 5 hours depending on vehicle size and condition, including steam cleaning, UV protectant, and high-lubricity wax.',
    },
    {
      question: 'How long does ceramic coating last?',
      answer:
        'Our premium ceramic coating includes full paint correction and a 2-day indoor curing process, providing lasting gloss and paint protection for 2 to 5 years with proper maintenance.',
    },
    {
      question: 'Do I need an appointment for a basic hand wash?',
      answer:
        'Walk-ins are welcome for our basic hand wash package, but booking an appointment guarantees your time slot and lets us prepare the right equipment for cars, SUVs, or vans.',
    },
  ];

  return (
    <>
      <FAQJsonLd faqs={carWashFaqs} locale={locale} />
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

      {(() => {
        const serviceAreas = serviceT.raw(
          'pages.carWashDetailing.serviceAreas',
        );
        const relatedArticles = serviceT.raw(
          'pages.carWashDetailing.relatedArticles',
        );
        return (
          <>
            {/* Service Areas by Location */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl font-bold mb-4">
                {serviceAreas.heading}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
                {serviceAreas.intro}
              </p>
              <div className="grid gap-8 md:grid-cols-2">
                {(
                  serviceAreas.locations as Array<{
                    city: string;
                    description: string;
                  }>
                ).map((location, idx) => (
                  <div
                    key={idx}
                    className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800"
                  >
                    <h3 className="text-2xl font-semibold mb-3 text-blue-900 dark:text-blue-100">
                      {location.city}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {location.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Related Articles CTA */}
            <section className="py-16 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-900 dark:to-blue-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl font-bold mb-4 text-white">
                  {relatedArticles.heading}
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  {relatedArticles.description}
                </p>
                <a
                  href={`/${locale}/blog`}
                  className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-200 transition"
                >
                  {relatedArticles.linkText} →
                </a>
              </div>
            </section>
          </>
        );
      })()}
    </>
  );
}
