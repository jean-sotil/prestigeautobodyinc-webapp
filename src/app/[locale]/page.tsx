import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { HeroCarousel, TrustBadges, StatsCounters } from '@/components/hero';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function HomePage() {
  const t = useTranslations('home');
  const common = useTranslations('common');

  return (
    <div className="font-sans min-h-screen">
      {/* Hero Carousel Section */}
      <section aria-label="Hero carousel">
        <HeroCarousel />
      </section>

      {/* Trust Badges Bar */}
      <TrustBadges />

      {/* Stats Counters */}
      <StatsCounters />

      {/* Services Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            {t('services.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {t('services.collision.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('services.collision.description')}
              </p>
              <Link
                href="/collision-repair"
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:underline"
              >
                {common('learnMore')}
              </Link>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {t('services.painting.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('services.painting.description')}
              </p>
              <Link
                href="/auto-painting"
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:underline"
              >
                {common('learnMore')}
              </Link>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {t('services.towing.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('services.towing.description')}
              </p>
              <Link
                href="/towing"
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:underline"
              >
                {common('learnMore')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            {t('whyChooseUs.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {t('whyChooseUs.experience.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('whyChooseUs.experience.description')}
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {t('whyChooseUs.certified.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('whyChooseUs.certified.description')}
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {t('whyChooseUs.insurance.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('whyChooseUs.insurance.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section
        id="get-a-quote"
        className="py-16 bg-gray-50 dark:bg-gray-900/50"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('quote.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('quote.description')}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
              {t('quote.comingSoon')}
            </p>
            <div className="flex justify-center">
              <Link
                href="/contact"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold transition"
              >
                {t('quote.ctaButton')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-600 dark:bg-red-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-lg mb-8">{t('cta.description')}</p>
          <Link
            href="/contact"
            className="bg-white text-red-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition inline-block"
          >
            {t('cta.button')}
          </Link>
        </div>
      </section>
    </div>
  );
}
