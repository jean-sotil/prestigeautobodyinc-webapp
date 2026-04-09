import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { StatsCounters, ResponsiveHero } from '@/components/hero';
import { YouTubeEmbed } from '@/components/embeds/YouTubeEmbed';
import QuoteForm from '@/components/quote-form/QuoteForm';
import { ButtonLink } from '@/components/ui/Button';
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
      {/* Hero Section — full-bleed image with dark overlay, white text */}
      <section
        className="relative w-full min-h-[420px] sm:min-h-[480px] lg:min-h-[540px] overflow-hidden"
        aria-label="Hero"
      >
        {/* Full-bleed edge-to-edge background image */}
        <div className="absolute inset-0 w-full h-full">
          <ResponsiveHero
            slug="homepage"
            alt="Prestige Auto Body shop interior with dark Mercedes sedan in the foreground and professional repair equipment"
            title="Prestige Auto Body Inc - Premium Auto Body Repair Shop in Silver Spring, MD"
            className="h-full"
          />
        </div>
        {/* Dark gradient overlay — heavy left, transparent right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.5) 50%, transparent 85%)',
          }}
        />

        {/* Content overlay — white text on dark hero */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-[64px] py-[64px] flex items-center min-h-[420px] sm:min-h-[480px] lg:min-h-[540px]">
          <div className="flex flex-col gap-[16px] w-full lg:w-[540px] shrink-0">
            <h1
              className="font-extrabold text-white text-[32px] md:text-[48px] leading-[1.2] tracking-[-0.72px] max-w-[480px] drop-shadow-lg"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Auto Body Shop &amp; Collision Repair in Silver Spring, MD
            </h1>
            <p className="text-white/80 text-base leading-[1.6]">
              For a better today &amp; tomorrow for your vehicle
            </p>
            <p className="font-bold text-sm text-white leading-[1.5]">
              Get your free estimate.
            </p>
            {/* Inline lead capture form over hero image */}
            <div className="flex flex-col sm:flex-row gap-[8px] items-stretch sm:items-center">
              <input
                type="email"
                placeholder="your@email.com"
                className="border border-white/30 rounded-lg px-4 text-sm text-white bg-white/10 backdrop-blur-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#C62828] h-[44px] w-full sm:w-[200px]"
                aria-label="Email address"
              />
              <input
                type="text"
                defaultValue="Silver Spring"
                className="border border-white/30 rounded-lg px-4 text-sm font-medium text-white bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#C62828] h-[44px] w-full sm:w-[160px]"
                aria-label="Location"
              />
              <ButtonLink
                href="/contact"
                variant="primary"
                size="lg"
                className="text-sm min-w-[160px] whitespace-nowrap"
              >
                Get a Quote
              </ButtonLink>
            </div>
            {/* Video play button — Car-O-Liner video */}
            <Link
              href="/gallery"
              className="flex items-center gap-[8px] w-fit group"
            >
              <div className="w-6 h-6 rounded-full bg-[#C62828] flex items-center justify-center flex-shrink-0 group-hover:bg-[#a82020] transition-colors">
                <svg
                  className="w-3 h-3 text-white ml-0.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="flex flex-col leading-[normal] text-sm">
                <span className="font-bold text-[#C62828]">See</span>
                <span className="text-white/90">our work.</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <StatsCounters />

      {/* Our Services Section */}
      <section
        className="py-16 bg-[#2D2D2D] dark:bg-[#1E1E1E]"
        aria-labelledby="services-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            id="services-heading"
            className="text-3xl md:text-4xl font-bold text-[#C62828] mb-10"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('services.title')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Collision Repair */}
            <article className="bg-white dark:bg-[#252525] border-2 border-[#C62828] rounded-lg p-6 flex flex-col items-center text-center gap-3 hover:shadow-lg transition-shadow">
              <CollisionIcon
                className="w-12 h-12 text-[#C62828]"
                aria-hidden="true"
              />
              <h3 className="font-bold text-[#2D2D2D] dark:text-[#E0E0E0] text-base">
                {t('services.collision.title')}
              </h3>
              <p className="text-[#555] dark:text-[#A0A0A0] text-sm leading-normal">
                {t('services.collision.description')}
              </p>
              <ButtonLink
                href="/collision-repair"
                variant="ghost"
                size="sm"
                className="mt-auto px-0 min-h-0 min-w-0"
              >
                {common('learnMore')} &gt;
              </ButtonLink>
            </article>

            {/* Auto Body Work */}
            <article className="bg-white dark:bg-[#252525] border-2 border-[#C62828] rounded-lg p-6 flex flex-col items-center text-center gap-3 hover:shadow-lg transition-shadow">
              <WrenchIcon
                className="w-12 h-12 text-[#C62828]"
                aria-hidden="true"
              />
              <h3 className="font-bold text-[#2D2D2D] dark:text-[#E0E0E0] text-base">
                {t('services.autoBody.title')}
              </h3>
              <p className="text-[#555] dark:text-[#A0A0A0] text-sm leading-normal">
                {t('services.autoBody.description')}
              </p>
              <ButtonLink
                href="/about"
                variant="ghost"
                size="sm"
                className="mt-auto px-0 min-h-0 min-w-0"
              >
                {common('learnMore')} &gt;
              </ButtonLink>
            </article>

            {/* Paint Solutions */}
            <article className="bg-white dark:bg-[#252525] border-2 border-[#C62828] rounded-lg p-6 flex flex-col items-center text-center gap-3 hover:shadow-lg transition-shadow">
              <PaintbrushIcon
                className="w-12 h-12 text-[#C62828]"
                aria-hidden="true"
              />
              <h3 className="font-bold text-[#2D2D2D] dark:text-[#E0E0E0] text-base">
                {t('services.painting.title')}
              </h3>
              <p className="text-[#555] dark:text-[#A0A0A0] text-sm leading-normal">
                {t('services.painting.description')}
              </p>
              <ButtonLink
                href="/auto-painting"
                variant="ghost"
                size="sm"
                className="mt-auto px-0 min-h-0 min-w-0"
              >
                {common('learnMore')} &gt;
              </ButtonLink>
            </article>

            {/* Insurance */}
            <article className="bg-white dark:bg-[#252525] border-2 border-[#C62828] rounded-lg p-6 flex flex-col items-center text-center gap-3 hover:shadow-lg transition-shadow">
              <ShieldIcon
                className="w-12 h-12 text-[#C62828]"
                aria-hidden="true"
              />
              <h3 className="font-bold text-[#2D2D2D] dark:text-[#E0E0E0] text-base">
                {t('services.insurance.title')}
              </h3>
              <p className="text-[#555] dark:text-[#A0A0A0] text-sm leading-normal">
                {t('services.insurance.description')}
              </p>
              <ButtonLink
                href="/insurance-claims"
                variant="ghost"
                size="sm"
                className="mt-auto px-0 min-h-0 min-w-0"
              >
                {common('learnMore')} &gt;
              </ButtonLink>
            </article>
          </div>
        </div>
      </section>

      {/* Why Choose Prestige Section - 2 column: bullets + YouTube */}
      <section
        className="py-16 bg-[#F5F5F5] dark:bg-[#1E1E1E]"
        aria-labelledby="why-choose-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 items-center">
          {/* Left: Bullets */}
          <div className="flex-1 flex flex-col gap-4 max-w-[480px]">
            <h2
              id="why-choose-heading"
              className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]"
              style={{ fontFamily: 'var(--font-display)' }}
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
                <div className="w-5 h-5 border-2 border-[#C62828] rounded flex-shrink-0" />
                <span className="text-[var(--text-primary)] text-sm">
                  {item}
                </span>
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
      <section
        className="py-16 bg-[#F5F5F5] dark:bg-[#1E1E1E]"
        aria-labelledby="free-estimate"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 items-center">
          <QuoteForm />
        </div>
      </section>

      {/* Limited Lifetime Warranty Section */}
      <section
        className="py-12 bg-white dark:bg-[#121212]"
        aria-labelledby="warranty-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-3 max-w-[550px]">
            <h2
              id="warranty-heading"
              className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Limited Lifetime Warranty
            </h2>
            <div className="w-[326px] max-w-full h-1 bg-[#C62828] rounded" />
            <p className="font-bold text-[var(--text-primary)] text-base">
              100% Satisfaction Guaranteed
            </p>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              Our technicians are the best in Silver Spring &amp; Montgomery
              County.
            </p>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
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
        className="py-16 bg-[#F5F5F5] dark:bg-[#1E1E1E]"
        aria-labelledby="testimonials-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6">
          <h2
            id="testimonials-heading"
            className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] text-center"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Customer Testimonials
          </h2>
          <p className="text-[var(--text-secondary)] text-sm text-center">
            What Our Happy Customers Are Saying
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {[
              {
                text: 'Great experience! They fixed my car after a collision and it looks brand new. Highly recommended!',
                name: '— Maria S.',
                location: 'Silver Spring, MD',
              },
              {
                text: 'Professional, honest, and fast. They worked directly with my insurance company. Excellent service!',
                name: '— James T.',
                location: 'Bethesda, MD',
              },
              {
                text: 'Best auto body shop in the area. 20+ years and it shows. Lifetime warranty gives real peace of mind.',
                name: '— Carlos R.',
                location: 'Rockville, MD',
              },
            ].map((review) => (
              <article
                key={review.name}
                className="bg-white dark:bg-[#252525] p-6 rounded-lg shadow-sm border border-[var(--border)] flex flex-col gap-3"
              >
                <span
                  className="text-[#C62828] text-4xl leading-none"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed italic">
                  {review.text}
                </p>
                <div className="text-[#C62828] text-sm">★★★★★</div>
                <p className="font-bold text-[var(--text-primary)] text-sm">
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
          <h2
            id="cta-heading"
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('cta.title')}
          </h2>
          <p className="text-[#ffe0e0] text-base">
            Contact us today for a free estimate. We work with all insurance
            companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <ButtonLink href="/contact" variant="inverted" size="lg">
              Get a Quote
            </ButtonLink>
            <ButtonLink
              href="tel:3015788779"
              variant="outline-white"
              size="lg"
              aria-label="Call (301) 578-8779"
            >
              (301) 578-8779
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
