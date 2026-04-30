import { ButtonLink } from '@/components/ui/Button';
import { PhoneIcon } from '@/components/ui/Icons';

interface CTABannerProps {
  headline: string;
  subtitle: string;
  ctaQuoteLabel: string;
  ctaPhoneLabel: string;
  phone: string;
  phoneDisplay: string;
  locale?: string;
}

export function CTABanner({
  headline,
  subtitle,
  ctaQuoteLabel,
  ctaPhoneLabel,
  phone,
  phoneDisplay,
  locale,
}: CTABannerProps) {
  return (
    <section className="bg-primary py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          className="text-2xl md:text-3xl font-bold text-white tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {headline}
        </h2>
        <p className="mt-4 text-base md:text-lg text-white/90 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <ButtonLink
            href="/get-a-quote"
            variant="inverted"
            size="lg"
            locale={locale}
            className="rounded-full shadow-lg"
          >
            {ctaQuoteLabel}
          </ButtonLink>
          <ButtonLink
            href={`tel:${phone}`}
            variant="outline-white"
            size="lg"
            className="rounded-full"
            aria-label={ctaPhoneLabel}
          >
            <PhoneIcon size={20} ariaLabel="" />
            <span className="ml-2">{phoneDisplay}</span>
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
