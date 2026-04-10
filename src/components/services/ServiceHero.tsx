import { ResponsiveHero } from '@/components/hero';
import { ButtonLink } from '@/components/ui/Button';
import { PhoneIcon } from '@/components/ui/Icons';

interface ServiceHeroProps {
  slug: string;
  imageAlt: string;
  title: string;
  description: string;
  ctaEstimateLabel: string;
  ctaPhoneLabel: string;
  phone: string;
  phoneDisplay: string;
}

export function ServiceHero({
  slug,
  imageAlt,
  title,
  description,
  ctaEstimateLabel,
  ctaPhoneLabel,
  phone,
  phoneDisplay,
}: ServiceHeroProps) {
  return (
    <section className="relative">
      {/* Hero image area */}
      <div className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] lg:h-[480px] overflow-hidden bg-gray-900">
        {/* Full-width background image */}
        <ResponsiveHero
          slug={slug}
          alt={imageAlt}
          title={title}
          className="absolute inset-0 w-full h-full"
        />

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-black/20" />
      </div>

      {/* Overlapping title card — breaks out of the hero */}
      <div className="relative z-10 -mt-20 sm:-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-background rounded-xl shadow-lg p-6 sm:p-8 lg:p-10">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {title}
            </h1>
            <p className="mt-3 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {description}
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <ButtonLink
                href="/get-a-quote"
                variant="primary"
                size="lg"
                className="rounded-full shadow-lg"
              >
                {ctaEstimateLabel}
              </ButtonLink>
              <ButtonLink
                href={`tel:${phone}`}
                variant="secondary"
                size="lg"
                className="rounded-full"
                aria-label={ctaPhoneLabel}
              >
                <PhoneIcon size={20} ariaLabel="" />
                <span className="ml-2">{phoneDisplay}</span>
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
