import React, { type ComponentProps } from 'react';
import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { Link } from '@/i18n/navigation';

import { cn } from '@/lib/utils';

type AppHref = ComponentProps<typeof Link>['href'];

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a]:hover:bg-primary/80',
        outline:
          'border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
        ghost:
          'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default:
          'h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        icon: 'size-8',
        'icon-xs':
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        'icon-sm':
          'size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg',
        'icon-lg': 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

/* Legacy button variants for backwards compatibility */
type LegacyButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'inverted'
  | 'outline-white';
type LegacyButtonSize = 'sm' | 'md' | 'lg';

interface LegacyButtonBaseProps {
  children: React.ReactNode;
  variant?: LegacyButtonVariant;
  size?: LegacyButtonSize;
  className?: string;
  disabled?: boolean;
  'aria-label'?: string;
}

interface LegacyButtonProps extends LegacyButtonBaseProps {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

interface ButtonLinkProps extends LegacyButtonBaseProps {
  href: AppHref | string;
  onClick?: () => void;
}

interface IconButtonProps extends LegacyButtonProps {
  icon: React.ReactNode;
}

const legacyBaseStyles =
  'inline-flex items-center justify-center font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer';

const legacySizeStyles: Record<LegacyButtonSize, string> = {
  sm: 'min-h-[44px] min-w-[44px] px-6 py-2 text-sm rounded-lg',
  md: 'min-h-[44px] min-w-[44px] px-6 py-2.5 text-base rounded-lg',
  lg: 'h-12 min-w-[44px] px-6 py-3 text-base rounded-lg',
};

const legacyVariantStyles: Record<LegacyButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-primary active:bg-primary/80',
  secondary:
    'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-primary active:bg-primary/90 active:text-primary-foreground transition-colors',
  ghost: 'text-primary hover:underline focus-visible:outline-primary',
  inverted:
    'bg-white text-primary hover:bg-gray-100 focus-visible:outline-white active:bg-gray-200',
  'outline-white':
    'border-2 border-white text-white hover:bg-white/10 focus-visible:outline-white active:bg-white/20',
};

function getLegacyButtonClasses(
  variant: LegacyButtonVariant,
  size: LegacyButtonSize,
  className: string,
): string {
  return `${legacyBaseStyles} ${legacySizeStyles[size]} ${legacyVariantStyles[variant]} ${className}`.trim();
}

function LegacyButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  'aria-label': ariaLabel,
}: LegacyButtonProps) {
  return (
    <button
      type={type}
      className={getLegacyButtonClasses(variant, size, className)}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

function ButtonLink({
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
        className={getLegacyButtonClasses(variant, size, className)}
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
      className={getLegacyButtonClasses(variant, size, className)}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled || undefined}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
}

function IconButton({
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
      className={getLegacyButtonClasses(variant, size, className)}
      disabled={disabled}
      onClick={onClick}
      aria-label={isIconOnly ? ariaLabel : undefined}
    >
      <span className={children ? 'mr-2' : ''}>{icon}</span>
      {children}
    </button>
  );
}

export { Button, buttonVariants, ButtonLink, IconButton, LegacyButton };
