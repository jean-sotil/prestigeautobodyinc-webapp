import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { HeroCarousel, TrustBadges, StatsCounters } from '@/components/hero';
import { YouTubeEmbed } from '@/components/embeds/YouTubeEmbed';
import { QuoteFormDynamic } from '@/components/forms/QuoteFormDynamic';
import { QuoteFormStyles } from '@/components/forms/QuoteForm';
import {
  CollisionIcon,
  WrenchIcon,
  PaintbrushIcon,
  ArrowRightIcon,
  PhoneIcon,
  AwardIcon,
  ShieldIcon,
  CheckCircleIcon,
  ThumbsUpIcon,
  ToolsIcon,
  StarIcon,
} from '@/components/ui/Icons';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function HomePage() {
  const t = useTranslations('home');
  const common = useTranslations('common');

  return (
    <div className="font-sans min-h-screen">
      {/* Inject QuoteForm animation styles */}
      <QuoteFormStyles />
      {/* Hero Carousel Section */}
      <section aria-label="Hero carousel">
        <HeroCarousel />
      </section>

      {/* Trust Badges Bar */}
      <TrustBadges />

      {/* Stats Counters */}
      <StatsCounters />

      {/* Services Grid Section */}
      <section
        className="py-16 bg-gray-50 dark:bg-gray-900/50"
        aria-labelledby="services-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            id="services-heading"
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white"
          >
            {t('services.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Collision Repair Card */}
            <article className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-6">
                <CollisionIcon
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                {t('services.collision.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {t('services.collision.description')}
              </p>
              <Link
                href="/collision-repair"
                className="inline-flex items-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold group"
              >
                <span>{common('learnMore')}</span>
                <ArrowRightIcon
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </Link>
            </article>

            {/* Auto Body Work Card */}
            <article className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-6">
                <WrenchIcon
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                {t('services.autoBody.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {t('services.autoBody.description')}
              </p>
              <Link
                href="/about"
                className="inline-flex items-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold group"
              >
                <span>{common('learnMore')}</span>
                <ArrowRightIcon
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </Link>
            </article>

            {/* Auto Painting Card */}
            <article className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-6">
                <PaintbrushIcon
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                {t('services.painting.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {t('services.painting.description')}
              </p>
              <Link
                href="/auto-painting"
                className="inline-flex items-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold group"
              >
                <span>{common('learnMore')}</span>
                <ArrowRightIcon
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* 24/7 Towing Callout Section */}
      <section
        className="py-12 bg-red-600 dark:bg-red-700"
        aria-labelledby="towing-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <PhoneIcon className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <div>
                <h2
                  id="towing-heading"
                  className="text-2xl md:text-3xl font-bold text-white"
                >
                  {t('towing.title')}
                </h2>
                <p className="text-red-100 dark:text-red-200 mt-1">
                  {t('towing.description')}
                </p>
              </div>
            </div>
            <a
              href={`tel:${t('towing.phone').replace(/\D/g, '')}`}
              className="inline-flex items-center gap-2 bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg transition shadow-lg hover:shadow-xl"
            >
              <PhoneIcon className="w-5 h-5" aria-hidden="true" />
              <span>{t('towing.cta')}</span>
            </a>
          </div>
        </div>
      </section>

      {/* YouTube Video Section */}
      <section
        className="py-16 bg-white dark:bg-gray-900"
        aria-labelledby="video-heading"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2
              id="video-heading"
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
            >
              {t('video.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('video.description')}
            </p>
          </div>
          <YouTubeEmbed videoId="dQw4w9WgXcQ" title={t('video.playButton')} />
        </div>
      </section>

      {/* Why Choose Us Section - 6 Differentiators in 2-Column Grid */}
      <section
        className="py-16 bg-gray-50 dark:bg-gray-900/50"
        aria-labelledby="why-choose-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            id="why-choose-heading"
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white"
          >
            {t('whyChooseUs.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Experience */}
            <article className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <AwardIcon
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  {t('whyChooseUs.experience.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('whyChooseUs.experience.description')}
                </p>
              </div>
            </article>

            {/* Certified */}
            <article className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShieldIcon
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  {t('whyChooseUs.certified.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('whyChooseUs.certified.description')}
                </p>
              </div>
            </article>

            {/* Insurance */}
            <article className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircleIcon
                  className="w-6 h-6 text-purple-600 dark:text-purple-400"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  {t('whyChooseUs.insurance.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('whyChooseUs.insurance.description')}
                </p>
              </div>
            </article>

            {/* Quality Guarantee */}
            <article className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <ThumbsUpIcon
                  className="w-6 h-6 text-amber-600 dark:text-amber-400"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  {t('whyChooseUs.quality.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('whyChooseUs.quality.description')}
                </p>
              </div>
            </article>

            {/* Equipment */}
            <article className="flex items-start gap-4">
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <ToolsIcon
                  className="w-6 h-6 text-cyan-600 dark:text-cyan-400"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  {t('whyChooseUs.equipment.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('whyChooseUs.equipment.description')}
                </p>
              </div>
            </article>

            {/* Satisfaction/Rating */}
            <article className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <StarIcon
                  className="w-6 h-6 text-orange-600 dark:text-orange-400"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  {t('whyChooseUs.satisfaction.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('whyChooseUs.satisfaction.description')}
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section id="get-a-quote" className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('quote.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('quote.description')}
            </p>
          </div>

          {/* Dynamic QuoteForm with skeleton loading state */}
          <QuoteFormDynamic />
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
