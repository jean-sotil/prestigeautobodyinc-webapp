'use client';

import { useTranslations } from 'next-intl';
import NextLink from 'next/link';
import { Link } from '@/i18n/navigation';

interface FooterProps {
  className?: string;
}

export default function Footer({ className = '' }: FooterProps) {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '/collision-repair', label: t('quickLinks.collisionRepair') },
    { href: '/about', label: t('quickLinks.autoBodyServices') },
    { href: '/auto-painting', label: t('quickLinks.paintSolutions') },
    { href: '/insurance-claims', label: t('quickLinks.insuranceClaims') },
    { href: '/get-a-quote', label: t('quickLinks.getAQuote') },
    { href: '/about', label: t('quickLinks.about') },
  ];

  const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3101.2820420367487!2d-77.0394!3d39.0194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b7cf5c6f98a8c3%3A0x7e3b8f1e2c4a6d9e!2s928%20Philadelphia%20Ave%2C%20Silver%20Spring%2C%20MD%2020910!5e0!3m2!1sen!2sus!4v1234567890000!5m2!1sen!2sus`;

  return (
    <footer className={`bg-[#1A1A1A] dark:bg-[#0A0A0A] ${className}`}>
      {/* Main Footer Content - 4 Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Company Info */}
          <div className="flex flex-col gap-2">
            <h2
              className="text-sm font-bold text-white uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('company.title')}
            </h2>
            <address className="not-italic flex flex-col gap-1 text-xs text-gray-400">
              <div itemScope itemType="https://schema.org/LocalBusiness">
                <span itemProp="name" className="sr-only">
                  {t('company.title')}
                </span>
                <p itemProp="streetAddress">{t('company.address')}</p>
                <p>{t('company.address2')}</p>
              </div>
              <div className="flex flex-col gap-1 mt-1">
                <p>
                  Phone:{' '}
                  <a
                    href="tel:+13015788779"
                    className="hover:text-[#c62828] transition-colors"
                    itemProp="telephone"
                  >
                    {t('company.phone')}
                  </a>
                </p>
                <p>
                  Fax:{' '}
                  <a
                    href="tel:+13015857791"
                    className="hover:text-[#c62828] transition-colors"
                  >
                    {t('company.fax')}
                  </a>
                </p>
                <p>
                  <a
                    href="mailto:info@prestigeautobodyinc.com"
                    className="hover:text-[#c62828] transition-colors"
                    itemProp="email"
                  >
                    {t('company.email')}
                  </a>
                </p>
              </div>
            </address>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-2">
            <h2
              className="text-sm font-bold text-white uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('quickLinks.title')}
            </h2>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-2">
                {quickLinks.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <Link
                      href={link.href as '/'}
                      className="text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 3: Business Hours */}
          <div className="flex flex-col gap-2">
            <h2
              className="text-sm font-bold text-white uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('hours.title')}
            </h2>
            <div className="flex flex-col gap-2 text-xs text-gray-400">
              <p>{t('hours.monday')}</p>
              <p>{t('hours.saturday')}</p>
              <p>{t('hours.sunday')}</p>
            </div>
          </div>

          {/* Column 4: Google Map Embed */}
          <div className="flex flex-col gap-2">
            <h2
              className="text-sm font-bold text-white uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('findUs.title')}
            </h2>
            <div className="w-full h-40 rounded-lg overflow-hidden bg-[#2e2e2e] border border-[#333]">
              <iframe
                src={mapEmbedUrl}
                title={t('findUs.mapTitle')}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#808080]">
              {t('copyright', { year: currentYear })}
            </p>
            <nav
              aria-label="Legal links"
              className="flex items-center gap-4 sm:gap-6"
            >
              <NextLink
                href="/privacy-policy"
                className="text-xs text-[#808080] hover:text-[#c62828] transition-colors"
              >
                {t('legal.privacy')}
              </NextLink>
              <NextLink
                href="/terms-of-service"
                className="text-xs text-[#808080] hover:text-[#c62828] transition-colors"
              >
                {t('legal.terms')}
              </NextLink>
              <NextLink
                href="/sitemap"
                className="text-xs text-[#808080] hover:text-[#c62828] transition-colors"
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
