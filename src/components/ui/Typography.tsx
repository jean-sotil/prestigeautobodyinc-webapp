import React from 'react';

/**
 * Typography variant options
 */
export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body'
  | 'body-large'
  | 'body-small'
  | 'caption'
  | 'label';

/**
 * Typography weight options
 */
export type TypographyWeight = 'normal' | 'medium' | 'semibold' | 'bold';

/**
 * Typography color options
 */
export type TypographyColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'inverse';

interface TypographyProps {
  /** Content to render */
  children: React.ReactNode;
  /** Typography style variant */
  variant?: TypographyVariant;
  /** HTML element to render (defaults based on variant) */
  as?: React.ElementType;
  /** Font weight */
  weight?: TypographyWeight;
  /** Text color variant */
  color?: TypographyColor;
  /** Additional CSS classes */
  className?: string;
  /** Language attribute for i18n */
  lang?: 'en' | 'es' | string;
}

/**
 * Get variant-specific class names
 */
function getVariantClasses(variant: TypographyVariant): string {
  const variantMap: Record<TypographyVariant, string> = {
    h1: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
    h2: 'text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight',
    h3: 'text-2xl md:text-3xl font-semibold tracking-tight',
    h4: 'text-xl md:text-2xl font-semibold',
    h5: 'text-lg md:text-xl font-semibold',
    h6: 'text-base md:text-lg font-semibold',
    'body-large': 'text-lg md:text-xl leading-relaxed',
    body: 'text-base leading-relaxed',
    'body-small': 'text-sm leading-relaxed',
    caption: 'text-xs leading-normal',
    label: 'text-sm font-medium leading-normal',
  };
  return variantMap[variant];
}

/**
 * Get weight-specific class names
 */
function getWeightClasses(weight: TypographyWeight): string {
  const weightMap: Record<TypographyWeight, string> = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };
  return weightMap[weight];
}

/**
 * Get color-specific class names
 */
function getColorClasses(color: TypographyColor): string {
  const colorMap: Record<TypographyColor, string> = {
    default: 'text-gray-900 dark:text-gray-100',
    primary: 'text-red-600 dark:text-red-400',
    secondary: 'text-gray-700 dark:text-gray-300',
    muted: 'text-gray-500 dark:text-gray-400',
    inverse: 'text-white dark:text-gray-900',
  };
  return colorMap[color];
}

/**
 * Get default element for each variant
 */
function getDefaultElement(variant: TypographyVariant): string {
  if (variant.startsWith('h')) {
    return variant;
  }
  if (variant === 'caption' || variant === 'label') {
    return 'span';
  }
  return 'p';
}

/**
 * Typography component with semantic HTML and SEO-optimized heading hierarchy
 *
 * Features:
 * - Semantic HTML tags (h1-h6, p, span) for proper SEO
 * - Supports both lang="en" and lang="es" attributes
 * - Proper heading hierarchy for accessibility
 * - Dark mode support
 * - Consistent sizing and spacing
 *
 * @example
 * <Typography variant="h1">Page Title</Typography>
 * <Typography variant="body" color="muted">Description text</Typography>
 * <Typography variant="h2" as="h3">Styled as h3 but looks like h2</Typography>
 */
export function Typography({
  children,
  variant = 'body',
  as,
  weight,
  color = 'default',
  className = '',
  lang,
  ...props
}: TypographyProps & Omit<React.HTMLAttributes<HTMLElement>, 'className'>) {
  const Element = (as || getDefaultElement(variant)) as React.ElementType;
  const variantClasses = getVariantClasses(variant);
  const weightClasses = weight ? getWeightClasses(weight) : '';
  const colorClasses = getColorClasses(color);

  return (
    <Element
      className={`${variantClasses} ${weightClasses} ${colorClasses} ${className}`.trim()}
      lang={lang}
      {...props}
    >
      {children}
    </Element>
  );
}

/**
 * H1 component - Page title (only one per page for SEO)
 *
 * @example
 * <H1>Auto Body Repair Services</H1>
 */
export function H1(props: Omit<TypographyProps, 'variant' | 'as'>) {
  return <Typography {...props} variant="h1" as="h1" />;
}

/**
 * H2 component - Section headings
 *
 * @example
 * <H2>Our Services</H2>
 */
export function H2(props: Omit<TypographyProps, 'variant' | 'as'>) {
  return <Typography {...props} variant="h2" as="h2" />;
}

/**
 * H3 component - Subsection headings
 *
 * @example
 * <H3>Collision Repair</H3>
 */
export function H3(props: Omit<TypographyProps, 'variant' | 'as'>) {
  return <Typography {...props} variant="h3" as="h3" />;
}

/**
 * H4 component - Sub-subsection headings
 *
 * @example
 * <H4>Painting Services</H4>
 */
export function H4(props: Omit<TypographyProps, 'variant' | 'as'>) {
  return <Typography {...props} variant="h4" as="h4" />;
}

/**
 * H5 component - Small headings
 *
 * @example
 * <H5>Contact Information</H5>
 */
export function H5(props: Omit<TypographyProps, 'variant' | 'as'>) {
  return <Typography {...props} variant="h5" as="h5" />;
}

/**
 * H6 component - Smallest headings
 *
 * @example
 * <H6>Additional Details</H6>
 */
export function H6(props: Omit<TypographyProps, 'variant' | 'as'>) {
  return <Typography {...props} variant="h6" as="h6" />;
}

/**
 * Body component - Main text content
 *
 * @example
 * <Body>We provide comprehensive auto body repair services...</Body>
 */
export function Body({
  large,
  small,
  ...props
}: Omit<TypographyProps, 'variant' | 'as'> & {
  large?: boolean;
  small?: boolean;
}) {
  let variant: TypographyVariant = 'body';
  if (large) variant = 'body-large';
  if (small) variant = 'body-small';
  return <Typography {...props} variant={variant} as="p" />;
}

/**
 * Caption component - Small helper text
 *
 * @example
 * <Caption>* Required fields</Caption>
 */
export function Caption(props: Omit<TypographyProps, 'variant' | 'as'>) {
  return <Typography {...props} variant="caption" as="span" />;
}

/**
 * Label component - Form labels and UI labels
 *
 * @example
 * <Label htmlFor="email">Email Address</Label>
 */
export function Label({
  htmlFor,
  ...props
}: Omit<TypographyProps, 'variant' | 'as'> & { htmlFor?: string }) {
  return (
    <Typography
      {...props}
      variant="label"
      as="label"
      weight="medium"
      {...(htmlFor ? { htmlFor } : {})}
    />
  );
}

/**
 * LeadText component - Introductory/lead paragraph styling
 *
 * @example
 * <LeadText>Welcome to Prestige Auto Body...</LeadText>
 */
export function LeadText(
  props: Omit<TypographyProps, 'variant' | 'as' | 'color'>,
) {
  return (
    <Typography
      {...props}
      variant="body-large"
      as="p"
      color="secondary"
      className={`max-w-2xl ${props.className || ''}`}
    />
  );
}

/**
 * VisuallyHidden component - Screen reader only text
 *
 * @example
 * <VisuallyHidden>Skip to main content</VisuallyHidden>
 */
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0 clip-[rect(0,0,0,0)]">
      {children}
    </span>
  );
}
