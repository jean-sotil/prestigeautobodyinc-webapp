import Image from 'next/image';
import type { HeroMedia } from '@/lib/heroMedia';

interface ResponsiveHeroProps {
  slug: string;
  alt: string;
  title: string;
  priority?: boolean;
  className?: string;
  children?: React.ReactNode;
  /** Optional Payload-served media. When provided, renders Next Image; otherwise falls back to the static /hero/{slug}/... art-directed crops. */
  media?: HeroMedia | null;
}

/**
 * Responsive hero image. Prefers a Payload media URL via Next Image
 * (auto-generates webp/avif at standard breakpoint widths). Falls back
 * to the legacy <picture> with art-directed static crops in /public/hero
 * if no media doc is supplied.
 */
export function ResponsiveHero({
  slug,
  alt,
  title,
  priority = true,
  className = '',
  children,
  media,
}: ResponsiveHeroProps) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {media?.url ? (
        <Image
          src={media.url}
          alt={alt}
          title={title}
          fill
          sizes="100vw"
          priority={priority}
          fetchPriority={priority ? 'high' : 'auto'}
          quality={90}
          className="object-cover"
        />
      ) : (
        <picture>
          {/* Mobile: ≤767px */}
          <source
            media="(max-width: 767px)"
            srcSet={`/hero/${slug}/mobile/${slug}-hero-mobile.webp`}
            type="image/webp"
          />
          <source
            media="(max-width: 767px)"
            srcSet={`/hero/${slug}/mobile/${slug}-hero-mobile.jpg`}
            type="image/jpeg"
          />
          {/* Tablet: 768px–1023px */}
          <source
            media="(max-width: 1023px)"
            srcSet={`/hero/${slug}/tablet/${slug}-hero-tablet.webp`}
            type="image/webp"
          />
          <source
            media="(max-width: 1023px)"
            srcSet={`/hero/${slug}/tablet/${slug}-hero-tablet.jpg`}
            type="image/jpeg"
          />
          {/* Desktop: ≥1024px */}
          <source
            srcSet={`/hero/${slug}/desktop/${slug}-hero-desktop.webp`}
            type="image/webp"
          />
          <img
            src={`/hero/${slug}/desktop/${slug}-hero-desktop.jpg`}
            alt={alt}
            title={title}
            className="absolute inset-0 w-full h-full object-cover"
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding={priority ? 'sync' : 'async'}
          />
        </picture>
      )}
      {children}
    </div>
  );
}

/**
 * Page-level hero banner with title overlay.
 * Full-width with absolute-positioned background image and transparent gradient.
 * Used on service pages (collision repair, painting, etc.)
 */
interface PageHeroBannerProps {
  slug: string;
  alt: string;
  title: string;
  heading: string;
  subtitle?: string;
  media?: HeroMedia | null;
}

export function PageHeroBanner({
  slug,
  alt,
  title,
  heading,
  subtitle,
  media,
}: PageHeroBannerProps) {
  return (
    <section className="relative w-full h-60 sm:h-80 md:h-[400px] lg:h-[450px] overflow-hidden">
      {/* Full-width absolute background image */}
      <ResponsiveHero
        slug={slug}
        alt={alt}
        title={title}
        media={media}
        className="absolute inset-0 w-full h-full"
      />
      {/* Transparent gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
      {/* Content */}
      <div className="absolute top-0 left-0 z-10 flex items-end h-full pb-10 sm:pb-14 lg:pb-16">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {heading}
          </h1>
          {subtitle && (
            <p className="mt-3 text-base md:text-lg lg:text-xl text-white/90 drop-shadow-md max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
