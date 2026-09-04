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

  const title = t(`pages.${SERVICE_KEY}.metaTitle`);
  const description = t(`pages.${SERVICE_KEY}.metaDescription`);
  const ogLocale = locale === 'es' ? 'es_US' : 'en_US';
  const OG_IMAGE = '/hero/homepage/desktop/homepage-hero-desktop.webp';
  const enPath = '/en/auto-painting';
  const esPath = '/es/pintura-de-autos';
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

  // Expanded FAQ with paint process, technology, warranty, pricing, etc.
  const autoPaintingFaqs = t
    .raw(`pages.autoPainting.faqExpanded`)
    .map((faq: { question: string; answer: string }) => ({
      question: faq.question,
      answer: faq.answer,
    }));

  const processSection = t.raw(`pages.${SERVICE_KEY}.processSection`);
  const techSection = t.raw(`pages.${SERVICE_KEY}.technologySection`);
  const warrantySection = t.raw(`pages.${SERVICE_KEY}.warrantySection`);
  const pricingSection = t.raw(`pages.${SERVICE_KEY}.pricingSection`);

  return (
    <>
      <ServiceJsonLd
        serviceName="Auto Painting"
        description={t(`pages.${SERVICE_KEY}.metaDescription`)}
        url={`https://prestigeautobodyinc.com/${locale}/auto-painting`}
        serviceType="Auto Painting"
        showAggregateRating
        locale={locale}
      />
      <FAQJsonLd faqs={autoPaintingFaqs} locale={locale} />
      <BreadcrumbJsonLd items={breadcrumbItems} locale={locale} />
      <ServicePageTemplate
        serviceKey={SERVICE_KEY}
        heroSlug="paint-solutions"
        locale={locale}
        heroMedia={heroMedia}
        heroAlt={pickAlt(
          heroMedia,
          locale,
          t(`pages.${SERVICE_KEY}.heroImageAlt`),
        )}
      />

      {/* Paint Process Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold mb-6">{processSection.heading}</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
          {processSection.intro}
        </p>
        <div className="grid gap-8 md:grid-cols-2">
          {(
            processSection.steps as Array<{
              title: string;
              description: string;
            }>
          ).map((step, idx) => (
            <div
              key={idx}
              className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800"
            >
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Paint-Match Technology Section */}
      <section className="py-16 bg-blue-50 dark:bg-blue-950 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-lg">
        <h2 className="text-4xl font-bold mb-6">{techSection.heading}</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
          {techSection.intro}
        </p>
        <div className="grid gap-8 md:grid-cols-2">
          {Object.entries(techSection.technology).map(
            ([key, tech]: [string, { title: string; description: string }]) => (
              <div
                key={key}
                className="bg-white dark:bg-gray-900 p-6 rounded-lg"
              >
                <h3 className="text-xl font-semibold mb-3">{tech.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {tech.description}
                </p>
              </div>
            ),
          )}
        </div>
      </section>

      {/* Warranty Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold mb-6">{warrantySection.heading}</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          {warrantySection.intro}
        </p>
        <div className="bg-green-50 dark:bg-green-950 p-8 rounded-lg border-l-4 border-green-500">
          <h3 className="text-2xl font-semibold mb-6 text-green-900 dark:text-green-100">
            What&apos;s Covered
          </h3>
          <ul className="space-y-4">
            {(warrantySection.coverage as string[]).map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 font-bold">
                  ✓
                </span>
                <span className="text-gray-700 dark:text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-gray-600 dark:text-gray-400 italic">
            <strong>Note:</strong> {warrantySection.exclusions}
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-lg">
        <h2 className="text-4xl font-bold mb-6">{pricingSection.heading}</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
          {pricingSection.intro}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="border border-gray-300 dark:border-gray-600 p-4 font-semibold">
                  Service
                </th>
                <th className="border border-gray-300 dark:border-gray-600 p-4 font-semibold">
                  Price Range
                </th>
                <th className="border border-gray-300 dark:border-gray-600 p-4 font-semibold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {(
                pricingSection.priceOptions as Array<{
                  service: string;
                  price: string;
                  description: string;
                }>
              ).map((option, idx) => (
                <tr
                  key={idx}
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="border border-gray-300 dark:border-gray-600 p-4 font-semibold">
                    {option.service}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 p-4 text-green-600 dark:text-green-400 font-semibold">
                    {option.price}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 p-4 text-gray-700 dark:text-gray-300">
                    {option.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-8 text-gray-600 dark:text-gray-400 text-sm">
          {pricingSection.note}
        </p>
      </section>
    </>
  );
}
