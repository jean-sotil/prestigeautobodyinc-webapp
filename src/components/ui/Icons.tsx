import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  ariaLabel?: string;
}

/**
 * Phone Icon
 */
export function PhoneIcon({
  className = '',
  size = 24,
  ariaLabel = 'Phone',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(ariaLabel
        ? { 'aria-label': ariaLabel, role: 'img' }
        : { 'aria-hidden': true })}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

/**
 * Email Icon
 */
export function EmailIcon({
  className = '',
  size = 24,
  ariaLabel = 'Email',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(ariaLabel
        ? { 'aria-label': ariaLabel, role: 'img' }
        : { 'aria-hidden': true })}
    >
      <rect x={2} y={4} width={20} height={16} rx={2} />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

/**
 * Location Icon
 */
export function LocationIcon({
  className = '',
  size = 24,
  ariaLabel = 'Location',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(ariaLabel
        ? { 'aria-label': ariaLabel, role: 'img' }
        : { 'aria-hidden': true })}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx={12} cy={10} r={3} />
    </svg>
  );
}

/**
 * Clock Icon
 */
export function ClockIcon({
  className = '',
  size = 24,
  ariaLabel = 'Business hours',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(ariaLabel
        ? { 'aria-label': ariaLabel, role: 'img' }
        : { 'aria-hidden': true })}
    >
      <circle cx={12} cy={12} r={10} />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

/**
 * Wrench Icon (Services)
 */
export function WrenchIcon({
  className = '',
  size = 24,
  ariaLabel = 'Services',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(ariaLabel
        ? { 'aria-label': ariaLabel, role: 'img' }
        : { 'aria-hidden': true })}
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

/**
 * Shield Icon (Insurance/Certification)
 */
export function ShieldIcon({
  className = '',
  size = 24,
  ariaLabel = 'Certified',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(ariaLabel
        ? { 'aria-label': ariaLabel, role: 'img' }
        : { 'aria-hidden': true })}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

/**
 * Award Icon (Experience)
 */
export function AwardIcon({
  className = '',
  size = 24,
  ariaLabel = 'Award',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(ariaLabel
        ? { 'aria-label': ariaLabel, role: 'img' }
        : { 'aria-hidden': true })}
    >
      <circle cx={12} cy={8} r={6} />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

/**
 * Car Icon
 */
export function CarIcon({
  className = '',
  size = 24,
  ariaLabel = 'Auto service',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(ariaLabel
        ? { 'aria-label': ariaLabel, role: 'img' }
        : { 'aria-hidden': true })}
    >
      <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" />
      <circle cx={6.5} cy={16.5} r={2.5} />
      <circle cx={16.5} cy={16.5} r={2.5} />
    </svg>
  );
}

/**
 * Paintbrush Icon (Auto Painting)
 */
export function PaintbrushIcon({
  className = '',
  size = 24,
  ariaLabel = 'Painting',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(ariaLabel
        ? { 'aria-label': ariaLabel, role: 'img' }
        : { 'aria-hidden': true })}
    >
      <path d="m14.622 17.897-10.68-2.913" />
      <path d="M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z" />
      <path d="M9 8c-1.804 2.71-3.97 3.46-6.583 4.729a1 1 0 0 0-.587 1.207l1.046 4.143a1 1 0 0 0 1.206.587 30.565 30.565 0 0 0 4.729-6.583" />
      <path d="M15.5 12.5 21 7" />
    </svg>
  );
}

/**
 * Tow Truck Icon
 */
export function TowTruckIcon({
  className = '',
  size = 24,
  ariaLabel = 'Towing',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(ariaLabel
        ? { 'aria-label': ariaLabel, role: 'img' }
        : { 'aria-hidden': true })}
    >
      <path d="M17.5 17.5a2.5 2.5 0 0 1-5 0V17H6a2 2 0 0 0-2 2v1" />
      <path d="M12 17h2.5a2.5 2.5 0 0 0 2.5-2.5V12h-2a2 2 0 0 0-2 2v3z" />
      <circle cx="5.5" cy="17.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
      <path d="M2 19.5V11a2 2 0 0 1 2-2h6l2-4h6l-2 4h2a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

/**
 * ChevronRight Icon
 */
export function ChevronRightIcon({
  className = '',
  size = 24,
  ariaLabel = 'Next',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(ariaLabel
        ? { 'aria-label': ariaLabel, role: 'img' }
        : { 'aria-hidden': true })}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/**
 * Menu Icon
 */
export function MenuIcon({
  className = '',
  size = 24,
  ariaLabel = 'Menu',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(ariaLabel
        ? { 'aria-label': ariaLabel, role: 'img' }
        : { 'aria-hidden': true })}
    >
      <line x1={4} x2={20} y1={12} y2={12} />
      <line x1={4} x2={20} y1={6} y2={6} />
      <line x1={4} x2={20} y1={18} y2={18} />
    </svg>
  );
}

/**
 * Close Icon
 */
export function CloseIcon({
  className = '',
  size = 24,
  ariaLabel = 'Close',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(ariaLabel
        ? { 'aria-label': ariaLabel, role: 'img' }
        : { 'aria-hidden': true })}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

/**
 * Sun Icon (for light mode)
 */
export function SunIcon({
  className = '',
  size = 24,
  ariaLabel = 'Light mode',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(ariaLabel
        ? { 'aria-label': ariaLabel, role: 'img' }
        : { 'aria-hidden': true })}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

/**
 * Moon Icon (for dark mode)
 */
export function MoonIcon({
  className = '',
  size = 24,
  ariaLabel = 'Dark mode',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(ariaLabel
        ? { 'aria-label': ariaLabel, role: 'img' }
        : { 'aria-hidden': true })}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

/**
 * Collision/Damage Icon
 */
export function CollisionIcon({
  className = '',
  size = 24,
  ariaLabel = 'Collision repair',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(ariaLabel
        ? { 'aria-label': ariaLabel, role: 'img' }
        : { 'aria-hidden': true })}
    >
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

/**
 * Checkmark Icon
 */
export function CheckCircleIcon({
  className = '',
  size = 24,
  ariaLabel = 'Verified',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(ariaLabel
        ? { 'aria-label': ariaLabel, role: 'img' }
        : { 'aria-hidden': true })}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

/**
 * Star Icon
 */
export function StarIcon({
  className = '',
  size = 24,
  ariaLabel = 'Rating',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(ariaLabel
        ? { 'aria-label': ariaLabel, role: 'img' }
        : { 'aria-hidden': true })}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

/**
 * Quality/Thumbs Up Icon
 */
export function ThumbsUpIcon({
  className = '',
  size = 24,
  ariaLabel = 'Quality guarantee',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(ariaLabel
        ? { 'aria-label': ariaLabel, role: 'img' }
        : { 'aria-hidden': true })}
    >
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

/**
 * Heart/Customer Service Icon
 */
export function HeartIcon({
  className = '',
  size = 24,
  ariaLabel = 'Customer satisfaction',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(ariaLabel
        ? { 'aria-label': ariaLabel, role: 'img' }
        : { 'aria-hidden': true })}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

/**
 * Tools/Workshop Icon
 */
export function ToolsIcon({
  className = '',
  size = 24,
  ariaLabel = 'Equipment',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(ariaLabel
        ? { 'aria-label': ariaLabel, role: 'img' }
        : { 'aria-hidden': true })}
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      <path d="M17 17l-2.3 2.3" />
    </svg>
  );
}

/**
 * Arrow Right Icon
 */
export function ArrowRightIcon({
  className = '',
  size = 24,
  ariaLabel = 'Arrow',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label={ariaLabel}
      aria-hidden="true"
      role="img"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/**
 * Quote/Document Icon
 */
export function QuoteIcon({
  className = '',
  size = 24,
  ariaLabel = 'Quote',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(ariaLabel
        ? { 'aria-label': ariaLabel, role: 'img' }
        : { 'aria-hidden': true })}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 15h6" />
      <path d="M9 12h6" />
    </svg>
  );
}
