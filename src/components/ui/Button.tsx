import React, { type ComponentProps } from 'react';
import { Link } from '@/i18n/navigation';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'inverted'
  | 'outline-white';
type ButtonSize = 'sm' | 'md' | 'lg';

type AppHref = ComponentProps<typeof Link>['href'];

interface ButtonBaseProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
  'aria-label'?: string;
}

interface ButtonProps extends ButtonBaseProps {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

interface ButtonLinkProps extends ButtonBaseProps {
  href: AppHref | string;
  onClick?: () => void;
}

interface IconButtonProps extends ButtonProps {
  icon: React.ReactNode;
}

const baseStyles =
  'inline-flex items-center justify-center font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer';

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'min-h-[44px] min-w-[44px] px-6 py-2 text-sm rounded-lg',
  md: 'min-h-[44px] min-w-[44px] px-6 py-2.5 text-base rounded-lg',
  lg: 'h-12 min-w-[44px] px-6 py-3 text-base rounded-lg',
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#C62828] text-white hover:bg-[#B71C1C] focus-visible:outline-[#C62828] active:bg-[#8b1c1c]',
  secondary:
    'border-2 border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white focus-visible:outline-[#C62828] active:bg-[#B71C1C] active:text-white transition-colors',
  ghost: 'text-[#C62828] hover:underline focus-visible:outline-[#C62828]',
  inverted:
    'bg-white text-[#C62828] hover:bg-gray-100 focus-visible:outline-white active:bg-gray-200',
  'outline-white':
    'border-2 border-white text-white hover:bg-white/10 focus-visible:outline-white active:bg-white/20',
};

function getButtonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  className: string,
): string {
  return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`.trim();
}

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
  return (
    <button
      type={type}
      className={getButtonClasses(variant, size, className)}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  'aria-label': ariaLabel,
}: ButtonLinkProps) {
  const hrefStr = typeof href === 'string' ? href : '';
  const isExternal =
    hrefStr.startsWith('http') ||
    hrefStr.startsWith('tel:') ||
    hrefStr.startsWith('mailto:');

  if (isExternal) {
    return (
      <a
        href={hrefStr}
        className={getButtonClasses(variant, size, className)}
        onClick={disabled ? undefined : onClick}
        aria-disabled={disabled || undefined}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href as AppHref}
      className={getButtonClasses(variant, size, className)}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled || undefined}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
}

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
}: IconButtonProps) {
  const isIconOnly = !children;

  return (
    <button
      type={type}
      className={getButtonClasses(variant, size, className)}
      disabled={disabled}
      onClick={onClick}
      aria-label={isIconOnly ? ariaLabel : undefined}
    >
      <span className={children ? 'mr-2' : ''}>{icon}</span>
      {children}
    </button>
  );
}
