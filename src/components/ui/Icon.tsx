import React from 'react';

/**
 * Icon size presets
 */
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

/**
 * Base props for all icon components
 */
export interface IconProps {
  /** Additional CSS classes */
  className?: string;
  /** Icon size - preset or custom pixel value */
  size?: IconSize;
  /** Accessible label for the icon */
  ariaLabel?: string;
  /** Whether the icon is decorative only (hides from screen readers) */
  decorative?: boolean;
}

/**
 * Get pixel value from size preset or number
 */
function getSizePixels(size: IconSize): number {
  if (typeof size === 'number') return size;

  const sizeMap: Record<Exclude<IconSize, number>, number> = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 48,
  };

  return sizeMap[size];
}

/**
 * Icon wrapper component using currentColor for theme-adaptive icons
 *
 * Features:
 * - Uses currentColor for automatic theme adaptation (zero JS cost)
 * - SVG inlined for zero external requests
 * - Supports aria-label or decorative-only mode
 * - Consistent sizing interface
 *
 * @example
 * <Icon className="text-red-600">
 *   <path d="M12 2L2 22h20L12 2z" />
 * </Icon>
 */
export function Icon({
  children,
  className = '',
  size = 'md',
  ariaLabel,
  decorative = false,
}: IconProps & { children: React.ReactNode }) {
  const pixelSize = getSizePixels(size);

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block flex-shrink-0 ${className}`}
      aria-label={decorative ? undefined : ariaLabel}
      aria-hidden={decorative || undefined}
      role={decorative ? undefined : 'img'}
    >
      {children}
    </svg>
  );
}

/**
 * Icon with fill variant (for solid icons instead of stroked)
 *
 * @example
 * <IconFill className="text-red-600">
 *   <circle cx="12" cy="12" r="10" />
 * </IconFill>
 */
export function IconFill({
  children,
  className = '',
  size = 'md',
  ariaLabel,
  decorative = false,
}: IconProps & { children: React.ReactNode }) {
  const pixelSize = getSizePixels(size);

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`inline-block flex-shrink-0 ${className}`}
      aria-label={decorative ? undefined : ariaLabel}
      aria-hidden={decorative || undefined}
      role={decorative ? undefined : 'img'}
    >
      {children}
    </svg>
  );
}

/**
 * IconButton - Icon rendered as a button (44×44px touch target)
 *
 * Features:
 * - WCAG 2.5.5 compliant touch target (≥ 44×44px)
 * - Visible focus ring
 * - Required aria-label for accessibility
 *
 * @example
 * <IconButton
 *   onClick={() => setOpen(true)}
 *   ariaLabel="Open menu"
 *   icon={<MenuIcon />}
 * />
 */
export function IconButton({
  onClick,
  ariaLabel,
  icon,
  className = '',
  disabled = false,
}: {
  onClick: () => void;
  ariaLabel: string;
  icon: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center min-h-[44px] min-w-[44px] p-2 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${className}`}
    >
      {icon}
    </button>
  );
}

/**
 * IconLink - Icon rendered as a link (44×44px touch target)
 *
 * @example
 * <IconLink
 *   href="/menu"
 *   ariaLabel="Menu"
 *   icon={<MenuIcon />}
 * />
 */
export function IconLink({
  href,
  ariaLabel,
  icon,
  className = '',
}: {
  href: string;
  ariaLabel: string;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center min-h-[44px] min-w-[44px] p-2 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${className}`}
    >
      {icon}
    </a>
  );
}
