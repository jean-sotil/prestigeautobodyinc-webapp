import { getLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { PageHeroBanner } from '@/components/hero';
import { getHeroMedia, pickAlt } from '@/lib/heroMedia';
import { BreadcrumbJsonLd, generateBreadcrumbItems } from '@/components/seo';
import { ServiceJsonLd } from '@/components/services';

const FALLBACK_ALT =
  'Professional flatbed tow truck providing 24/7 emergency roadside assistance and towing services at night with amber emergency lights';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function TowingPage() {
  const [heroMedia, locale, nav, t] = await Promise.all([
    getHeroMedia('towing-24-7'),
    getLocale(),
    getTranslations('nav'),
    getTranslations('services'),
  ]);

  const breadcrumbItems = generateBreadcrumbItems(
    nav('towing'),
    `/${locale}/towing`,
    nav('home'),
    locale,
  );

  return (
    <div className="font-sans min-h-screen">
      <ServiceJsonLd
        serviceName="24/7 Towing Service"
        description="Emergency towing services available 24 hours a day, 7 days a week in Silver Spring, MD and surrounding areas"
        url={`https://prestigeautobodyinc.com/${locale}/towing`}
        serviceType="Towing Service"
        locale={locale}
      />
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
        <p className="text-lg text-(--text-secondary) leading-relaxed">
          Our professional tow truck operators are ready to assist you around
          the clock, ensuring your vehicle is safely transported to our
          facility. Available 24 hours a day, 7 days a week.
        </p>
      </main>
    </div>
  );
}
