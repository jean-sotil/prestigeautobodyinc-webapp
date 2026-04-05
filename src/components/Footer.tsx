'use client';

import { useTranslations } from 'next-intl';
import NextLink from 'next/link';
import { Link } from '@/i18n/navigation';
import {
  PhoneIcon,
  EmailIcon,
  LocationIcon,
  ClockIcon,
} from '@/components/ui/Icons';

interface FooterProps {
  className?: string;
}

/**
 * Footer component with 4-column layout
 * - Company Info (address, phone, fax, email)
 * - Quick Links
 * - Business Hours
 * - Google Map embed
 *
 * Features:
 * - NAP consistency for Local SEO
 * - Semantic HTML with proper heading structure
 * - Accessible contact links (tel:, mailto:)
 * - Responsive: 4-col → 2-col → 1-col
 * - Dark mode support
 * - i18n ready (EN/ES)
 * - Lazy-loaded map iframe
 */
export default function Footer({ className = '' }: FooterProps) {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  // Quick links navigation items
  const quickLinks = [
    { href: '/', label: t('quickLinks.home') },
    { href: '/collision-repair', label: t('quickLinks.services') },
    { href: '/about', label: t('quickLinks.about') },
    { href: '/contact', label: t('quickLinks.contact') },
    { href: '/gallery', label: t('quickLinks.gallery') },
    { href: '/locations', label: t('quickLinks.locations') },
  ];

  // Google Maps embed URL with dark mode support
  // Uses embed API with styling parameter for dark tiles
  const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3101.2820420367487!2d-77.0394!3d39.0194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b7cf5c6f98a8c3%3A0x7e3b8f1e2c4a6d9e!2s928%20Philadelphia%20Ave%2C%20Silver%20Spring%2C%20MD%2020910!5e0!3m2!1sen!2sus!4v1234567890000!5m2!1sen!2sus`;

  return (
    <footer
      className={`bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 ${className}`}
    >
      {/* Main Footer Content - 4 Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Company Info - NAP for Local SEO */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('company.title')}
            </h2>
            <address className="not-italic space-y-3 text-sm text-gray-600 dark:text-gray-400">
              {/* Address - structured for LocalBusiness schema */}
              <div className="flex items-start gap-2">
                <LocationIcon
                  size={18}
                  className="mt-0.5 flex-shrink-0 text-red-600 dark:text-red-500"
                  ariaLabel=""
                />
                <div itemScope itemType="https://schema.org/LocalBusiness">
                  <span itemProp="name" className="sr-only">
                    {t('company.title')}
                  </span>
                  <span
                    itemProp="address"
                    itemScope
                    itemType="https://schema.org/PostalAddress"
                  >
                    <span itemProp="streetAddress">{t('company.address')}</span>
                    <br />
                    <span itemProp="addressLocality">Silver Spring</span>,{' '}
                    <span itemProp="addressRegion">MD</span>{' '}
                    <span itemProp="postalCode">20910</span>
                  </span>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2">
                <PhoneIcon
                  size={18}
                  className="flex-shrink-0 text-red-600 dark:text-red-500"
                  ariaLabel=""
                />
                <a
                  href="tel:+13015788779"
                  className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  itemProp="telephone"
                >
                  {t('company.phone')}
                </a>
              </div>

              {/* Fax */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-500 w-[18px] text-center">
                  Fax
                </span>
                <a
                  href="tel:+13015788780"
                  className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  {t('company.fax')}
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                <EmailIcon
                  size={18}
                  className="flex-shrink-0 text-red-600 dark:text-red-500"
                  ariaLabel=""
                />
                <a
                  href="mailto:info@prestigeautobodyinc.com"
                  className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  itemProp="email"
                >
                  {t('company.email')}
                </a>
              </div>
            </address>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('quickLinks.title')}
            </h2>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href as '/'}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 3: Business Hours */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('hours.title')}
            </h2>
            <div className="flex items-start gap-2">
              <ClockIcon
                size={18}
                className="mt-0.5 flex-shrink-0 text-red-600 dark:text-red-500"
                ariaLabel=""
              />
              <table className="text-sm text-gray-600 dark:text-gray-400">
                <tbody>
                  <tr>
                    <th scope="row" className="text-left font-normal pr-4">
                      {t('hours.monday')}
                    </th>
                  </tr>
                  <tr>
                    <th scope="row" className="text-left font-normal pr-4 pt-1">
                      {t('hours.saturday')}
                    </th>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="text-left font-normal pr-4 pt-1 text-gray-500 dark:text-gray-500"
                    >
                      {t('hours.sunday')}
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Column 4: Google Map Embed */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('findUs.title')}
            </h2>
            <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
              <iframe
                src={mapEmbedUrl}
                title={t('findUs.mapTitle')}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[20%] dark:invert-[90%] dark:hue-rotate-180"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Legal Links */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {t('copyright', { year: currentYear })}
            </p>
            <nav
              aria-label="Legal links"
              className="flex items-center gap-4 sm:gap-6"
            >
              <NextLink
                href="/privacy-policy"
                className="text-sm text-gray-500 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                {t('legal.privacy')}
              </NextLink>
              <NextLink
                href="/terms-of-service"
                className="text-sm text-gray-500 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                {t('legal.terms')}
              </NextLink>
              <NextLink
                href="/sitemap"
                className="text-sm text-gray-500 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                {t('legal.sitemap')}
              </NextLink>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
