import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

type Size = 'hero' | 'banner';
type Position = 'top-center' | 'top-right';

interface GoldClassWatermarkProps {
  size?: Size;
  position?: Position;
}

const sizeClasses: Record<Size, string> = {
  hero: 'w-16 h-16 sm:w-40 sm:h-40 md:w-60 md:h-60 lg:w-80 lg:h-80',
  banner: 'w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24',
};

const positionClasses: Record<Position, string> = {
  'top-center': 'top-2 left-1/2 -translate-x-1/2 sm:top-6 lg:top-8',
  'top-right': 'top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6',
};

/**
 * The I-CAR Gold Class mark is a certification, not decoration: on pages that
 * do not state the credential in body copy (auto-painting, rental-assistance)
 * this image is its only carrier, so it needs a real alt rather than
 * alt="" + aria-hidden.
 */
export async function GoldClassWatermark({
  size = 'hero',
  position = 'top-center',
}: GoldClassWatermarkProps) {
  const t = await getTranslations('common');
  return (
    <div
      className={`absolute pointer-events-none motion-safe:animate-fade-in-up z-0 ${positionClasses[position]}`}
      style={{ animationDelay: '600ms' }}
    >
      <Image
        src="/gold_class_icar_hero_logo.png"
        alt={t('icarWatermarkAlt')}
        width={200}
        height={200}
        className={`${sizeClasses[size]} animate-glow-pulse drop-shadow-[0_0_32px_rgba(200,180,80,0.6)]`}
      />
    </div>
  );
}
