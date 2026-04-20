import type { ComponentProps } from 'react';
import { Link } from '@/i18n/navigation';

type AppHref = ComponentProps<typeof Link>['href'];

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: AppHref | string;
  linkLabel: string;
}

/**
 * Service card — left-border accent + subtle red bloom overlay.
 * Intended for the homepage services grid and any future service-listing page.
 */
export function ServiceCard({
  icon,
  title,
  description,
  href,
  linkLabel,
}: ServiceCardProps) {
  return (
    <div
      className="
        group relative overflow-hidden rounded-xl
        bg-card
        border border-border border-l-4 border-l-primary
        p-5 md:p-6
        transition-all duration-200 ease-out
        hover:border-l-red-hover
        hover:-translate-y-0.5
        hover:bg-muted
      "
    >
      {/* Red gradient bloom — decorative */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-surface to-transparent"
        aria-hidden="true"
      />

      {/* Icon */}
      <div
        className="
          relative mb-4 flex h-10 w-10 items-center justify-center rounded-lg
          bg-red-surface border border-red-border
          text-red-hover
          transition-colors duration-200
          group-hover:bg-primary/20
        "
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="relative font-display text-lg font-bold tracking-display text-foreground mb-1.5">
        {title}
      </h3>

      {/* Description */}
      <p className="relative text-sm leading-relaxed text-muted-foreground line-clamp-3">
        {description}
      </p>

      {/* Link */}
      <Link
        href={href as AppHref}
        className="
          relative mt-4 inline-flex items-center gap-1.5
          text-xs font-semibold tracking-wider uppercase
          text-red-hover transition-colors hover:text-red-muted
        "
      >
        {linkLabel}
        <span
          className="transition-transform duration-150 group-hover:translate-x-0.5"
          aria-hidden="true"
        >
          →
        </span>
      </Link>
    </div>
  );
}
