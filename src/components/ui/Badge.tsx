import React from 'react';
import Image from 'next/image';

/**
 * Badge size options
 */
export type BadgeSize = 'sm' | 'md' | 'lg';

/**
 * Badge variant options
 */
export type BadgeVariant = 'default' | 'certification' | 'trust' | 'award';

/**
 * Common certification/accreditation data
 */
export interface CertificationInfo {
  /** Certification name */
  name: string;
  /** Organization name */
  organization: string;
  /** Description of certification */
  description?: string;
}

interface BaseBadgeProps {
  /** Badge text content */
  children?: React.ReactNode;
  /** Badge size */
  size?: BadgeSize;
  /** Badge visual style */
  variant?: BadgeVariant;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Predefined certification badges for the auto body industry
 */
export const CERTIFICATIONS = {
  ICAR: {
    name: 'I-CAR Gold Class',
    organization: 'I-CAR',
    description: 'Industry-leading collision repair training and certification',
  },
  ASE: {
    name: 'ASE Certified',
    organization: 'ASE',
    description: 'Automotive Service Excellence certification',
  },
  CARWISE: {
    name: 'Carwise Certified',
    organization: 'Carwise',
    description: 'Trusted collision repair network member',
  },
  OEM: {
    name: 'OEM Certified',
    organization: 'OEM',
    description: 'Original Equipment Manufacturer certified repairs',
  },
} as const;

/**
 * Get size-specific classes
 */
function getSizeClasses(size: BadgeSize): string {
  const sizeMap: Record<BadgeSize, string> = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };
  return sizeMap[size];
}

/**
 * Get variant-specific classes
 */
function getVariantClasses(variant: BadgeVariant): string {
  const variantMap: Record<BadgeVariant, string> = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    certification:
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-700',
    trust:
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-700',
    award:
      'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-700',
  };
  return variantMap[variant];
}

/**
 * Badge component for trust badges, certifications, and status indicators
 *
 * Features:
 * - Multiple visual variants (default, certification, trust, award)
 * - Semantic HTML with proper color contrast
 * - Dark mode support
 * - WCAG-compliant sizing
 *
 * @example
 * <Badge variant="certification">I-CAR Gold Class</Badge>
 */
export function Badge({
  children,
  size = 'md',
  variant = 'default',
  className = '',
}: BaseBadgeProps) {
  const sizeClasses = getSizeClasses(size);
  const variantClasses = getVariantClasses(variant);

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
}

/**
 * TrustBadge component - For displaying certification logos with proper alt text
 *
 * Features:
 * - Optimized image loading with Next.js Image component
 * - Proper alt text for accessibility
 * - Touch-friendly sizing
 * - Link wrapper to certification details
 *
 * @example
 * <TrustBadge
 *   src="/badges/icar-gold.png"
 *   alt="I-CAR Gold Class Certification"
 *   certification={CERTIFICATIONS.ICAR}
 *   href="https://www.i-car.com"
 * />
 */
export function TrustBadge({
  src,
  alt,
  certification,
  href,
  size = 'md',
  className = '',
}: {
  src: string;
  alt: string;
  certification?: CertificationInfo;
  href?: string;
  size?: BadgeSize;
  className?: string;
}) {
  const sizeMap: Record<BadgeSize, number> = {
    sm: 48,
    md: 64,
    lg: 80,
  };

  const pixelSize = sizeMap[size];

  // Build accessible description
  const accessibleLabel = certification
    ? `${certification.name} - ${certification.organization}${certification.description ? `: ${certification.description}` : ''}`
    : alt;

  const badgeContent = (
    <div
      className={`inline-flex flex-col items-center text-center ${className}`}
      title={accessibleLabel}
    >
      <div className="relative rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
        <Image
          src={src}
          alt={alt}
          width={pixelSize}
          height={pixelSize}
          className="object-contain"
          loading="lazy"
        />
      </div>
      {certification && (
        <span className="mt-1 text-xs text-gray-600 dark:text-gray-400 max-w-[120px]">
          {certification.name}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block min-h-[44px] min-w-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 rounded-lg"
        aria-label={`${accessibleLabel} - opens in new tab`}
      >
        {badgeContent}
      </a>
    );
  }

  return badgeContent;
}

/**
 * CertificationRow component - Display multiple certification badges in a row
 *
 * @example
 * <CertificationRow
 *   certifications={[
 *     { src: '/badges/icar.png', alt: 'I-CAR', certification: CERTIFICATIONS.ICAR },
 *     { src: '/badges/ase.png', alt: 'ASE', certification: CERTIFICATIONS.ASE },
 *   ]}
 * />
 */
export function CertificationRow({
  certifications,
  size = 'md',
  className = '',
}: {
  certifications: Array<{
    src: string;
    alt: string;
    certification?: CertificationInfo;
    href?: string;
  }>;
  size?: BadgeSize;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      {certifications.map((cert, index) => (
        <TrustBadge
          key={index}
          src={cert.src}
          alt={cert.alt}
          certification={cert.certification}
          href={cert.href}
          size={size}
        />
      ))}
    </div>
  );
}

/**
 * StatusBadge component - For status indicators (active, pending, etc.)
 *
 * @example
 * <StatusBadge status="active">Open Now</StatusBadge>
 */
export function StatusBadge({
  status,
  children,
  className = '',
}: {
  status: 'active' | 'inactive' | 'pending' | 'warning' | 'error';
  children: React.ReactNode;
  className?: string;
}) {
  const statusStyles: Record<typeof status, string> = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
    pending:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    warning:
      'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-sm font-medium rounded-full ${statusStyles[status]} ${className}`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          status === 'active'
            ? 'bg-green-500'
            : status === 'inactive'
              ? 'bg-gray-400'
              : status === 'pending'
                ? 'bg-yellow-500'
                : status === 'warning'
                  ? 'bg-orange-500'
                  : 'bg-red-500'
        }`}
        aria-hidden="true"
      />
      {children}
    </span>
  );
}
