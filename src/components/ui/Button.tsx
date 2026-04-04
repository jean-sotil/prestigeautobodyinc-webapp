import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

interface AnchorProps extends ButtonProps {
  href: string;
}

/**
 * Base styles for all button variants
 */
const baseStyles =
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';

/**
 * Size styles (all meet WCAG 2.5.5 minimum 44×44px touch targets)
 */
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'min-h-[44px] min-w-[44px] px-3 py-2 text-sm rounded',
  md: 'min-h-[44px] min-w-[44px] px-4 py-2 text-base rounded-md',
  lg: 'min-h-[44px] min-w-[44px] px-6 py-3 text-lg rounded-lg',
};

/**
 * Variant styles
 */
const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600 active:bg-red-800 dark:bg-red-500 dark:hover:bg-red-600 dark:active:bg-red-700',
  secondary:
    'border-2 border-red-600 text-red-600 hover:bg-red-50 focus-visible:outline-red-600 active:bg-red-100 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-950 dark:active:bg-red-900',
  ghost:
    'text-red-600 hover:bg-red-50 focus-visible:outline-red-600 active:bg-red-100 dark:text-red-400 dark:hover:bg-red-950 dark:active:bg-red-900',
};

/**
 * Get combined class names for button
 */
function getButtonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  className: string,
): string {
  return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;
}

/**
 * Button component with primary, secondary, and ghost variants
 *
 * Features:
 * - WCAG 2.5.5 compliant touch targets (≥ 44×44px)
 * - Visible focus ring with high contrast
 * - Dark mode support via Tailwind dark: variants
 *
 * For icon-only buttons, provide aria-label prop
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  'aria-label': ariaLabel,
}: ButtonProps) {
  const classes = getButtonClasses(variant, size, className);

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

/**
 * ButtonLink component - renders as <a> element
 *
 * For icon-only buttons, provide aria-label prop
 */
export function ButtonLink({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  'aria-label': ariaLabel,
}: AnchorProps) {
  const classes = getButtonClasses(variant, size, className);

  return (
    <a
      href={href}
      className={classes}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled || undefined}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}

/**
 * IconButton component - button with icon and optional text
 *
 * If children is not provided, aria-label is required
 */
export function IconButton({
  icon,
  children,
  'aria-label': ariaLabel,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
}: {
  icon: React.ReactNode;
  children?: React.ReactNode;
  'aria-label'?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}) {
  const isIconOnly = !children;
  const classes = getButtonClasses(variant, size, className);

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      aria-label={isIconOnly ? ariaLabel : undefined}
    >
      <span className={children ? 'mr-2' : ''}>{icon}</span>
      {children}
    </button>
  );
}
