'use client';

import Image from 'next/image';
import { ComponentProps } from 'react';

interface OptimizedImageProps extends Omit<
  ComponentProps<typeof Image>,
  'src'
> {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

/**
 * Optimized Image Component
 *
 * Wraps Next.js Image with sensible defaults for:
 * - WebP/AVIF format negotiation
 * - Responsive sizing
 * - Lazy loading (unless priority)
 * - Proper alt text handling
 *
 * @example
 * ```tsx
 * // Hero image (above-fold, priority loading)
 * <OptimizedImage
 *   src="/hero.jpg"
 *   alt="Auto body shop exterior"
 *   width={1200}
 *   height={600}
 *   priority
 *   sizes="100vw"
 * />
 *
 * // Content image (lazy loaded)
 * <OptimizedImage
 *   src="/service.jpg"
 *   alt="Collision repair process"
 *   width={800}
 *   height={600}
 *   sizes="(max-width: 768px) 100vw, 50vw"
 * />
 * ```
 */
export function OptimizedImage({
  alt,
  priority = false,
  className = '',
  sizes = '(max-width: 768px) 100vw, 50vw',
  ...props
}: OptimizedImageProps) {
  return (
    <Image
      alt={alt}
      priority={priority}
      sizes={sizes}
      className={`object-cover ${className}`}
      {...props}
    />
  );
}

/**
 * Hero Image Component
 * Preloaded for LCP optimization
 */
interface HeroImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export function HeroImage({
  src,
  alt,
  width,
  height,
  className = '',
}: HeroImageProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority
        sizes="100vw"
        className="object-cover w-full h-full"
      />
    </div>
  );
}

/**
 * Service Card Image
 * For service cards and grid layouts
 */
interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function CardImage({ src, alt, className = '' }: CardImageProps) {
  return (
    <div className={`relative overflow-hidden rounded-t-lg ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={400}
        height={300}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover w-full h-48 transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
}

/**
 * Gallery Image
 * For image galleries with lightbox support
 */
interface GalleryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function GalleryImage({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
}: GalleryImageProps) {
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
}
