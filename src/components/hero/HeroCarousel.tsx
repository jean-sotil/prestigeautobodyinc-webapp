'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button, ButtonLink } from '@/components/ui/Button';

interface Slide {
  id: number;
  slug: string;
  alt: string;
  imgTitle: string;
  title: string;
  subtitle: string;
}

interface HeroCarouselProps {
  slides?: Slide[];
}

const defaultSlides: Slide[] = [
  {
    id: 1,
    slug: 'homepage',
    alt: 'Prestige Auto Body - pristine luxury sedan in state-of-the-art auto body workshop with modern equipment and professional lighting',
    imgTitle:
      'Prestige Auto Body Inc - Premium Auto Body Repair Shop in Silver Spring, MD',
    title: 'hero.slide1.title',
    subtitle: 'hero.slide1.subtitle',
  },
  {
    id: 2,
    slug: 'collision-repair',
    alt: 'Professional collision repair technician using computerized frame measuring equipment with laser scanners and digital displays at Prestige Auto Body',
    imgTitle:
      'Expert Collision Repair Services - Computerized Frame Measuring & PDR',
    title: 'hero.slide2.title',
    subtitle: 'hero.slide2.subtitle',
  },
  {
    id: 3,
    slug: 'paint-solutions',
    alt: 'Advanced computerized paint color matching and formulation facility with downdraft paint booth and eco-friendly refinishing technology',
    imgTitle:
      'Premium Paint Solutions - Computerized Color Matching & Eco-Friendly Refinishing',
    title: 'hero.slide3.title',
    subtitle: 'hero.slide3.subtitle',
  },
  {
    id: 4,
    slug: 'auto-body-services',
    alt: 'Comprehensive auto body services including dent repair, structural frame work, bumper repair, alloy wheel restoration, glass replacement and spray painting',
    imgTitle:
      'Full-Service Auto Body Repair - Dent Repair, Structural Work, Paint & More',
    title: 'hero.slide4.title',
    subtitle: 'hero.slide4.subtitle',
  },
  {
    id: 5,
    slug: 'insurance-claims',
    alt: 'Professional insurance claims advisor reviewing documentation with satisfied customer at Prestige Auto Body consultation area',
    imgTitle: 'Insurance Claims Assistance - We Handle Your Paperwork',
    title: 'hero.slide5.title',
    subtitle: 'hero.slide5.subtitle',
  },
  {
    id: 6,
    slug: 'towing-24-7',
    alt: 'Professional flatbed tow truck providing 24/7 emergency roadside assistance and towing services at night with amber emergency lights',
    imgTitle:
      '24/7 Emergency Towing & Roadside Assistance in Silver Spring, MD',
    title: 'hero.slide6.title',
    subtitle: 'hero.slide6.subtitle',
  },
  {
    id: 7,
    slug: 'lifetime-warranty',
    alt: 'Satisfied customer receiving keys to beautifully restored luxury vehicle from Prestige Auto Body service advisor with lifetime warranty',
    imgTitle:
      'Limited Lifetime Warranty on All Repairs - Quality You Can Trust',
    title: 'hero.slide7.title',
    subtitle: 'hero.slide7.subtitle',
  },
];

export function HeroCarousel({ slides = defaultSlides }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('home');
  const locale = useLocale();

  // Set mounted state after hydration to avoid mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check for reduced motion preference (only after mount)
  useEffect(() => {
    if (!isMounted) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isMounted]);

  // Auto-advance carousel (only after mount)
  useEffect(() => {
    if (!isMounted || prefersReducedMotion || isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isMounted, isPaused, slides.length, prefersReducedMotion]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  const handleFocus = () => setIsPaused(true);
  const handleBlur = () => setIsPaused(false);

  const scrollToQuote = () => {
    const quoteSection = document.getElementById('get-a-quote');
    if (quoteSection) {
      quoteSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={carouselRef}
      className="relative w-full h-125 sm:h-150 md:h-175 lg:h-200 overflow-hidden bg-gray-900"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      role="region"
      aria-roledescription="carousel"
      aria-label={t('hero.carouselLabel')}
    >
      {/* Slides */}
      <div className="absolute inset-0 w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity ease-in-out ${
              prefersReducedMotion && isMounted ? 'duration-0' : 'duration-500'
            } ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            aria-roledescription="slide"
            aria-label={`${t('hero.slideLabel')} ${index + 1} ${t('hero.of')} ${slides.length}`}
            aria-hidden={index !== currentSlide}
          >
            {/* Responsive hero image via <picture> for art-directed breakpoints */}
            <div className="absolute inset-0 w-full">
              <picture>
                {/* Mobile: ≤767px */}
                <source
                  media="(max-width: 767px)"
                  srcSet={`/hero/${slide.slug}/mobile/${slide.slug}-hero-mobile.webp`}
                  type="image/webp"
                />
                <source
                  media="(max-width: 767px)"
                  srcSet={`/hero/${slide.slug}/mobile/${slide.slug}-hero-mobile.jpg`}
                  type="image/jpeg"
                />
                {/* Tablet: 768px–1023px */}
                <source
                  media="(max-width: 1023px)"
                  srcSet={`/hero/${slide.slug}/tablet/${slide.slug}-hero-tablet.webp`}
                  type="image/webp"
                />
                <source
                  media="(max-width: 1023px)"
                  srcSet={`/hero/${slide.slug}/tablet/${slide.slug}-hero-tablet.jpg`}
                  type="image/jpeg"
                />
                {/* Desktop: ≥1024px */}
                <source
                  srcSet={`/hero/${slide.slug}/desktop/${slide.slug}-hero-desktop.webp`}
                  type="image/webp"
                />
                {/* Fallback */}
                {}
                <img
                  src={`/hero/${slide.slug}/desktop/${slide.slug}-hero-desktop.jpg`}
                  alt={slide.alt}
                  title={slide.imgTitle}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  decoding={index === 0 ? 'sync' : 'async'}
                />
              </picture>
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-black/30" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-20 w-full h-full flex items-center justify-center">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {index === 0 ? (
                  // First slide has H1 for SEO
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                    {t(slide.title)}
                  </h1>
                ) : (
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                    {t(slide.title)}
                  </h2>
                )}
                <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 drop-shadow-md">
                  {t(slide.subtitle)}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={scrollToQuote}
                    variant="primary"
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {t('hero.ctaPrimary')}
                  </Button>
                  <ButtonLink
                    href={`/${locale}/contact`}
                    variant="secondary"
                    size="lg"
                    className="border-2 border-white text-white hover:bg-white hover:text-gray-900"
                  >
                    {t('hero.ctaSecondary')}
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-white min-h-[44px] min-w-[44px]"
        aria-label={t('hero.previousSlide')}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-white min-h-[44px] min-w-[44px]"
        aria-label={t('hero.nextSlide')}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Pagination Dots */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2"
        role="tablist"
        aria-label={t('hero.slideNavigation')}
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 min-h-[44px] min-w-[44px] ${
              index === currentSlide
                ? 'bg-white'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={t('hero.goToSlide', { number: index + 1 })}
            aria-selected={index === currentSlide}
            role="tab"
            tabIndex={index === currentSlide ? 0 : -1}
          />
        ))}
      </div>

      {/* Progress indicator for screen readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {t('hero.currentSlide', {
          current: currentSlide + 1,
          total: slides.length,
        })}
      </div>
    </div>
  );
}
