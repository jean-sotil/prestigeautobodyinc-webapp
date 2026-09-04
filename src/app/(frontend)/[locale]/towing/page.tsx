import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BASE_URL } from '@/lib/seo';
import { getPathname } from '@/i18n/navigation';
import { PageHeroBanner } from '@/components/hero';
import { getHeroMedia, pickAlt } from '@/lib/heroMedia';
import {
  BreadcrumbJsonLd,
  generateBreadcrumbItems,
  FAQJsonLd,
} from '@/components/seo';
import { ServiceJsonLd } from '@/components/services';

const PATHNAME = '/towing' as const;

const FALLBACK_ALT =
  'Professional flatbed tow truck providing 24/7 emergency roadside assistance and towing services at night with amber emergency lights';

const OG_IMAGE = '/hero/homepage/desktop/homepage-hero-desktop.webp';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title =
    locale === 'es'
      ? '24/7 Remolque Silver Spring, MD | Asistencia Vial'
      : '24/7 Towing Silver Spring, MD | Emergency Roadside Help';
  const description =
    locale === 'es'
      ? 'Remolque de emergencia 24/7 en Silver Spring, MD. Grúa de plataforma, saltos de batería, asistencia vial. Seguros aceptados.'
      : '24/7 emergency towing in Silver Spring, MD. Flatbed tow trucks, jump starts, lockout help. All insurance accepted. Free roadside assistance.';
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

export default async function TowingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [heroMedia, nav, t] = await Promise.all([
    getHeroMedia('towing-24-7'),
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'services' }),
  ]);

  const localizedPath = getPathname({
    locale: locale as 'en' | 'es',
    href: PATHNAME,
  });

  const breadcrumbItems = generateBreadcrumbItems(
    nav('towing'),
    localizedPath,
    nav('home'),
    locale,
  );

  const towingFaqs = [
    {
      question: 'Do you offer 24/7 towing services?',
      answer:
        'Yes. Prestige Auto Body provides 24/7 emergency towing and roadside assistance in Silver Spring, MD and the entire DMV area. Call (301) 578-8779 anytime for immediate dispatch.',
    },
    {
      question: 'How much does towing cost?',
      answer:
        'Towing costs vary by distance and vehicle type. If your repair is done at our shop, towing may be included. Many insurance policies also cover towing - we can help coordinate directly with your insurer.',
    },
    {
      question: 'What areas do you tow from?',
      answer:
        "We serve Silver Spring, Bethesda, Rockville, Takoma Park, Wheaton, College Park, Hyattsville, Chevy Chase, Columbia, Washington DC, and surrounding areas in Montgomery and Prince George's counties.",
    },
    {
      question: 'Can you tow my electric vehicle (EV)?',
      answer:
        'Yes. Our flatbed tow trucks safely transport electric and hybrid vehicles without putting stress on the drivetrain. We follow all manufacturer-recommended procedures for EV towing.',
    },
  ];

  return (
    <div className="font-sans min-h-screen">
      <ServiceJsonLd
        serviceName="24/7 Towing Service"
        description="Emergency towing services available 24 hours a day, 7 days a week in Silver Spring, MD and surrounding areas"
        url={`https://prestigeautobodyinc.com${localizedPath}`}
        serviceType="Towing Service"
        locale={locale}
      />
      <FAQJsonLd faqs={towingFaqs} locale={locale} />
      <BreadcrumbJsonLd items={breadcrumbItems} locale={locale} />
      <PageHeroBanner
        slug="towing-24-7"
        alt={pickAlt(heroMedia, locale, FALLBACK_ALT)}
        title="24/7 Emergency Towing & Roadside Assistance in Silver Spring, MD"
        heading="24/7 Towing"
        subtitle="Emergency towing services available when you need us most"
        media={heroMedia}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Emergency Towing When You Need It Most
          </h2>
          <p className="text-lg text-(--text-secondary) leading-relaxed mb-4">
            Our professional tow truck operators are ready to assist you around
            the clock, ensuring your vehicle is safely transported to our
            facility. Available 24 hours a day, 7 days a week in Silver Spring,
            MD and throughout the greater DMV area.
          </p>
          <p className="text-base text-(--text-secondary) leading-relaxed mb-4">
            Whether you&apos;ve been in an accident, have a flat tire, locked
            your keys in the car, or need a dead battery jump-started - our
            experienced operators respond quickly to get you off the road
            safely.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Our Towing & Roadside Services
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-base text-(--text-secondary)">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              Flatbed towing for all vehicle types
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              Accident scene towing & recovery
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              Jump starts & battery service
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              Lockout assistance
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              Flat tire changes
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              Long-distance transport
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              Insurance-direct towing
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              Direct delivery to our repair shop
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Areas We Serve
          </h2>
          <p className="text-base text-(--text-secondary) leading-relaxed mb-4">
            We provide towing services throughout Montgomery County, Prince
            George&apos;s County, and the Washington DC metropolitan area
            including:
          </p>
          <p className="text-base text-(--text-secondary) leading-relaxed">
            Silver Spring, Bethesda, Rockville, Takoma Park, Wheaton, College
            Park, Hyattsville, Chevy Chase, Columbia, and Washington DC.
          </p>
        </section>

        <section className="mb-12 bg-muted rounded-xl p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Why Choose Prestige for Towing?
          </h2>
          <ul className="space-y-3 text-base text-(--text-secondary)">
            <li>
              <strong>Direct to repair:</strong> Your vehicle goes straight to
              our I-CAR Gold Class certified shop - no middleman, no extra
              stops.
            </li>
            <li>
              <strong>Insurance coordination:</strong> We work with all major
              insurance companies and handle the paperwork from tow to repair
              completion.
            </li>
            <li>
              <strong>24/7 availability:</strong> Accidents don&apos;t follow
              business hours. Neither do we.
            </li>
            <li>
              <strong>Professional operators:</strong> Our drivers are trained
              to handle all vehicle types safely, including EVs and luxury
              vehicles.
            </li>
          </ul>
        </section>
      </main>

      {/* Service Areas by Location */}
      {(() => {
        const serviceAreas = t.raw('pages.towing.serviceAreas');
        const relatedArticles = t.raw('pages.towing.relatedArticles');
        return (
          <>
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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <section className="text-center py-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Need a Tow Right Now?
                </h2>
                <p className="text-base text-(--text-secondary) mb-4">
                  Call us 24/7 for immediate dispatch.
                </p>
                <a
                  href="tel:+13015788779"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-primary/90 transition-colors"
                >
                  Call (301) 578-8779
                </a>
              </section>
            </main>
          </>
        );
      })()}
    </div>
  );
}
