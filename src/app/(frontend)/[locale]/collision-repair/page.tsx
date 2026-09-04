import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BASE_URL } from '@/lib/seo';
import { ServicePageTemplate, ServiceJsonLd } from '@/components/services';
import { getHeroMedia, pickAlt } from '@/lib/heroMedia';
import {
  BreadcrumbJsonLd,
  generateBreadcrumbItems,
  FAQJsonLd,
} from '@/components/seo';

const SERVICE_KEY = 'collisionRepair';

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
  const currentPath =
    locale === 'es' ? '/reparacion-de-colisiones' : '/collision-repair';

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}${currentPath}`,
      languages: {
        en: `${BASE_URL}/en/collision-repair`,
        es: `${BASE_URL}/es/reparacion-de-colisiones`,
        'x-default': `${BASE_URL}/en/collision-repair`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}${currentPath}`,
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

export default async function CollisionRepairPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, heroMedia, nav] = await Promise.all([
    getTranslations({ locale, namespace: 'services' }),
    getHeroMedia('collision-repair'),
    getTranslations({ locale, namespace: 'nav' }),
  ]);

  const breadcrumbItems = generateBreadcrumbItems(
    nav('collisionRepair'),
    `/${locale}/collision-repair`,
    nav('home'),
    locale,
  );

  const collisionFaqs = [
    {
      question: 'What is included in collision repair?',
      answer:
        'Collision repair at Prestige Auto Body includes dent removal, frame straightening, panel replacement, repainting, and restoring the vehicle to its pre-accident condition. We use OEM and high-quality aftermarket parts and match paint using computer color-matching technology.',
    },
    {
      question: 'Will my car look the same after collision repair?',
      answer:
        'Yes. Our technicians use computer color-matching technology and I-CAR Gold Class techniques to restore your vehicle to its original factory appearance. We back every repair with a lifetime warranty.',
    },
    {
      question: 'Should I get multiple estimates for collision repair?',
      answer:
        'You have the legal right to choose your own repair shop in Maryland regardless of what your insurance company recommends. We offer free, no-obligation estimates and work directly with all insurance carriers.',
    },
  ];

  const serviceAreas = t.raw(`pages.${SERVICE_KEY}.serviceAreas`);
  const relatedArticles = t.raw(`pages.${SERVICE_KEY}.relatedArticles`);

  return (
    <>
      <FAQJsonLd faqs={collisionFaqs} locale={locale} />
      <ServiceJsonLd
        serviceName="Collision Repair"
        description={t(`pages.${SERVICE_KEY}.metaDescription`)}
        url={`https://prestigeautobodyinc.com/${locale}/collision-repair`}
        serviceType="Collision Repair"
        showAggregateRating
        locale={locale}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} locale={locale} />
      <ServicePageTemplate
        serviceKey={SERVICE_KEY}
        heroSlug="collision-repair"
        locale={locale}
        heroMedia={heroMedia}
        heroAlt={pickAlt(
          heroMedia,
          locale,
          t(`pages.${SERVICE_KEY}.heroImageAlt`),
        )}
      />

      {/* Service Areas by Location */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold mb-4">{serviceAreas.heading}</h2>
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
}
