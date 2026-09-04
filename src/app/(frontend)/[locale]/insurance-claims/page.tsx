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

  const title = t(`pages.${SERVICE_KEY}.metaTitle`);
  const description = t(`pages.${SERVICE_KEY}.metaDescription`);
  const ogLocale = locale === 'es' ? 'es_US' : 'en_US';
  const OG_IMAGE = '/hero/homepage/desktop/homepage-hero-desktop.webp';
  const enPath = '/en/insurance-claims';
  const esPath = '/es/reclamos-de-seguro';
  const currentPath = locale === 'es' ? esPath : enPath;

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

export default async function InsuranceClaimsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, heroMedia, nav] = await Promise.all([
    getTranslations({ locale, namespace: 'services' }),
    getHeroMedia('insurance-claims'),
    getTranslations({ locale, namespace: 'nav' }),
  ]);

  const breadcrumbItems = generateBreadcrumbItems(
    nav('insuranceClaims'),
    `/${locale}/insurance-claims`,
    nav('home'),
    locale,
  );

  const insuranceClaimsFaqs = [
    {
      question: 'Can I choose my own repair shop for an insurance claim?',
      answer:
        'Yes. Maryland law gives you the legal right to choose your own repair shop regardless of what your insurance company recommends. We work directly with all major carriers on your behalf.',
    },
    {
      question: 'Do you handle the insurance paperwork for me?',
      answer:
        'Yes. We manage the estimate submission, direct communication with your adjuster, and all supplemental claims paperwork so you do not have to navigate the insurance process alone.',
    },
    {
      question: 'Will using insurance affect my repair quality?',
      answer:
        'No. We use the same OEM and high-quality aftermarket parts and I-CAR Gold Class techniques on every insurance-covered repair as we do on out-of-pocket work, backed by our lifetime warranty.',
    },
  ];

  const serviceAreas = t.raw(`pages.${SERVICE_KEY}.serviceAreas`);
  const relatedArticles = t.raw(`pages.${SERVICE_KEY}.relatedArticles`);

  return (
    <>
      <ServiceJsonLd
        serviceName="Insurance Claims Assistance"
        description={t(`pages.${SERVICE_KEY}.metaDescription`)}
        url={`https://prestigeautobodyinc.com/${locale}/insurance-claims`}
        serviceType="Insurance Claims Assistance"
        showAggregateRating
        locale={locale}
      />
      <FAQJsonLd faqs={insuranceClaimsFaqs} locale={locale} />
      <BreadcrumbJsonLd items={breadcrumbItems} locale={locale} />
      <ServicePageTemplate
        serviceKey={SERVICE_KEY}
        heroSlug="insurance-claims"
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
