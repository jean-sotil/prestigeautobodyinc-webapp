import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { StatsCounters } from '@/components/hero';
import { YouTubeEmbed } from '@/components/embeds/YouTubeEmbed';
import { SimpleQuoteFormDynamic } from '@/components/forms/SimpleQuoteFormDynamic';
import {
  CollisionIcon,
  WrenchIcon,
  PaintbrushIcon,
  ShieldIcon,
} from '@/components/ui/Icons';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function HomePage() {
  const t = useTranslations('home');
  const common = useTranslations('common');

  return (
    <div className="font-sans min-h-screen">
      {/* Hero Section */}
      <section
        className="bg-white py-[64px] px-4 sm:px-8 lg:px-[64px]"
        aria-label="Hero"
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-0">
          {/* Left: Content */}
          <div className="flex flex-col gap-[16px] w-full lg:w-[540px] shrink-0">
            <h1 className="font-black text-[#2d2d2d] text-[36px] leading-[1.2] tracking-[-0.72px] max-w-[480px]">
              Auto Body Shop &amp; Collision Repair in Silver Spring, MD
            </h1>
            <p className="text-[#555] text-[16px] leading-[1.6]">
              For a better today &amp; tomorrow for your vehicle
            </p>
            <p className="font-bold text-[14px] text-[#2d2d2d] leading-[1.5]">
              Get your free estimate.
            </p>
            {/* Form row */}
            <div className="flex flex-col sm:flex-row gap-[8px] items-stretch sm:items-center">
              <input
                type="email"
                placeholder="your@email.com"
                className="border border-[#d1d5db] rounded-[8px] px-[16px] text-[14px] text-[#2d2d2d] placeholder-[#808080] focus:outline-none focus:ring-2 focus:ring-[#c62828] h-[44px] w-full sm:w-[200px]"
                aria-label="Email address"
              />
              <input
                type="text"
                defaultValue="Silver Spring"
                className="border border-[#d1d5db] rounded-[8px] px-[16px] text-[14px] font-medium text-[#2d2d2d] focus:outline-none focus:ring-2 focus:ring-[#c62828] h-[44px] w-full sm:w-[160px]"
                aria-label="Location"
              />
              <Link
                href="/contact"
                className="bg-[#c62828] hover:bg-[#a82020] text-white font-bold text-[14px] px-[24px] h-[48px] rounded-[8px] transition-colors text-center whitespace-nowrap flex items-center justify-center min-w-[160px]"
              >
                Get a Quote
              </Link>
            </div>
            {/* See Our Work */}
            <Link
              href="/gallery"
              className="flex items-center gap-[8px] w-fit group"
            >
              <div className="w-6 h-6 rounded-full bg-[#c62828] flex items-center justify-center flex-shrink-0 group-hover:bg-[#a82020] transition-colors">
                <svg
                  className="w-3 h-3 text-white ml-0.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="flex flex-col leading-[normal] text-[14px]">
                <span className="font-bold text-[#c62828]">See</span>
                <span className="text-[#2d2d2d]">our work.</span>
              </div>
            </Link>
          </div>

          {/* Right: Hero image */}
          <div className="w-full lg:w-[560px] h-[280px] lg:h-[340px] bg-[#385438] rounded-[12px] flex items-center justify-center overflow-hidden shrink-0">
            <span className="text-[#d9d9d9] text-[16px] font-medium">
              Professional Collision Repair
            </span>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <StatsCounters />

      {/* Our Services Section */}
      <section className="py-16 bg-white" aria-labelledby="services-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            id="services-heading"
            className="text-2xl font-bold text-[#2d2d2d] mb-10"
          >
            {t('services.title')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Collision Repair */}
            <article className="bg-white p-8 rounded-xl shadow-[0px_2px_8px_0px_rgba(0,0,0,0.1)] flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <CollisionIcon
                  className="w-6 h-6 text-[#c62828]"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-bold text-[#2d2d2d] text-base">
                {t('services.collision.title')}
              </h3>
              <p className="text-[#555] text-sm leading-normal">
                {t('services.collision.description')}
              </p>
              <Link
                href="/collision-repair"
                className="text-[#c62828] font-bold text-sm hover:underline mt-auto"
              >
                {common('learnMore')} →
              </Link>
            </article>

            {/* Auto Body Work */}
            <article className="bg-white p-8 rounded-xl shadow-[0px_2px_8px_0px_rgba(0,0,0,0.1)] flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <WrenchIcon
                  className="w-6 h-6 text-[#c62828]"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-bold text-[#2d2d2d] text-base">
                {t('services.autoBody.title')}
              </h3>
              <p className="text-[#555] text-sm leading-normal">
                {t('services.autoBody.description')}
              </p>
              <Link
                href="/about"
                className="text-[#c62828] font-bold text-sm hover:underline mt-auto"
              >
                {common('learnMore')} →
              </Link>
            </article>

            {/* Paint Solutions */}
            <article className="bg-white p-8 rounded-xl shadow-[0px_2px_8px_0px_rgba(0,0,0,0.1)] flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <PaintbrushIcon
                  className="w-6 h-6 text-[#c62828]"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-bold text-[#2d2d2d] text-base">
                {t('services.painting.title')}
              </h3>
              <p className="text-[#555] text-sm leading-normal">
                {t('services.painting.description')}
              </p>
              <Link
                href="/auto-painting"
                className="text-[#c62828] font-bold text-sm hover:underline mt-auto"
              >
                {common('learnMore')} →
              </Link>
            </article>

            {/* Insurance */}
            <article className="bg-white p-8 rounded-xl shadow-[0px_2px_8px_0px_rgba(0,0,0,0.1)] flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <ShieldIcon
                  className="w-6 h-6 text-[#c62828]"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-bold text-[#2d2d2d] text-base">
                {t('services.insurance.title')}
              </h3>
              <p className="text-[#555] text-sm leading-normal">
                {t('services.insurance.description')}
              </p>
              <Link
                href="/insurance-claims"
                className="text-[#c62828] font-bold text-sm hover:underline mt-auto"
              >
                {common('learnMore')} →
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* Why Choose Prestige Section - 2 column: bullets + YouTube */}
      <section
        className="py-16 bg-[#f5f5f5]"
        aria-labelledby="why-choose-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 items-center">
          {/* Left: Bullets */}
          <div className="flex-1 flex flex-col gap-4 max-w-[480px]">
            <h2
              id="why-choose-heading"
              className="text-[28px] font-bold text-[#2d2d2d]"
            >
              {t('whyChooseUs.title')}
            </h2>
            {[
              'More than two decades of collision repair experience',
              'I-CAR Gold Class certified technicians',
              'Lifetime warranty guarantee on all repairs',
              'Accept all major insurance and submit claims for you',
              'Computerized frame measuring & color matching',
              'Free estimates with no obligation',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-[#c62828] rounded flex-shrink-0" />
                <span className="text-[#2d2d2d] text-sm">{item}</span>
              </div>
            ))}
          </div>

          {/* Right: YouTube Embed */}
          <div className="flex-1 w-full max-w-[520px]">
            <YouTubeEmbed videoId="dQw4w9WgXcQ" title={t('video.playButton')} />
          </div>
        </div>
      </section>

      {/* Get Your Free Estimate Section */}
      <section id="get-a-quote" className="py-16 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-[28px] font-bold text-[#2d2d2d] mb-2">
              {t('quote.title')}
            </h2>
            <div className="w-[100px] h-1 bg-[#c62828] rounded" />
          </div>
          <div className="bg-white rounded-xl shadow-[0px_2px_8px_0px_rgba(0,0,0,0.06)] p-8 lg:p-12">
            <SimpleQuoteFormDynamic />
          </div>
        </div>
      </section>

      {/* Limited Lifetime Warranty Section */}
      <section className="py-12 bg-white" aria-labelledby="warranty-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-3 max-w-[550px]">
            <h2
              id="warranty-heading"
              className="text-[28px] font-bold text-[#2d2d2d]"
            >
              Limited Lifetime Warranty
            </h2>
            <div className="w-[326px] max-w-full h-1 bg-[#c62828] rounded" />
            <p className="font-bold text-[#2d2d2d] text-base">
              100% Satisfaction Guaranteed
            </p>
            <p className="text-[#555] text-sm leading-relaxed">
              Our technicians are the best in Silver Spring &amp; Montgomery
              County.
            </p>
            <p className="text-[#555] text-sm leading-relaxed">
              All collision repair services come with a lifetime warranty.
            </p>
          </div>
          <div className="flex-shrink-0 w-[200px] h-[76px] bg-[#8b0000] rounded-full flex flex-col items-center justify-center gap-1">
            <span className="text-white font-bold text-[10px] tracking-widest">
              LIFETIME
            </span>
            <span className="text-white font-bold text-[8px] tracking-widest">
              GUARANTEE
            </span>
            <span className="text-white font-bold text-sm">✓ 100%</span>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section
        className="py-16 bg-[#f5f5f5]"
        aria-labelledby="testimonials-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6">
          <h2
            id="testimonials-heading"
            className="text-[28px] font-bold text-[#2d2d2d] text-center"
          >
            Customer Testimonials
          </h2>
          <p className="text-[#555] text-sm text-center">
            What Our Happy Customers Are Saying
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {[
              {
                stars: '★★★★★',
                text: 'Great experience! They fixed my car after a collision and it looks brand new. Highly recommended!',
                name: '— Maria S.',
                location: 'Silver Spring, MD',
              },
              {
                stars: '★★★★★',
                text: 'Professional, honest, and fast. They worked directly with my insurance company. Excellent service!',
                name: '— James T.',
                location: 'Bethesda, MD',
              },
              {
                stars: '★★★★★',
                text: 'Best auto body shop in the area. 20+ years and it shows. Lifetime warranty gives real peace of mind.',
                name: '— Carlos R.',
                location: 'Rockville, MD',
              },
            ].map((review) => (
              <article
                key={review.name}
                className="bg-white p-6 rounded-xl shadow-[0px_2px_8px_0px_rgba(0,0,0,0.06)] flex flex-col gap-3"
              >
                <span className="text-[#c62828] text-sm">{review.stars}</span>
                <p className="text-[#555] text-sm leading-relaxed">
                  {review.text}
                </p>
                <p className="font-bold text-[#2d2d2d] text-sm">
                  {review.name}
                </p>
                <p className="text-[#808080] text-xs">{review.location}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section
        className="bg-[#c62828] py-16 text-white"
        aria-labelledby="cta-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-4 text-center">
          <h2 id="cta-heading" className="text-[28px] font-bold">
            {t('cta.title')}
          </h2>
          <p className="text-[#ffe0e0] text-base">
            Contact us today for a free estimate. We work with all insurance
            companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link
              href="/contact"
              className="bg-white text-[#c62828] font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get a Quote
            </Link>
            <a
              href="tel:3015788779"
              className="border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              (301) 578-8779
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
