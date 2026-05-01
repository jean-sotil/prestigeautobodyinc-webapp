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
                    className="underline underline-offset-2 hover:text-[#c62828] transition-colors"
                    itemProp="telephone"
                  >
                    {t('company.phone')}
                  </a>
                </p>
                <p>
                  Fax:{' '}
                  <a
                    href="tel:+13015857791"
                    className="underline underline-offset-2 hover:text-[#c62828] transition-colors"
                  >
                    {t('company.fax')}
                  </a>
                </p>
                <p>
                  <a
                    href="mailto:info@prestigeautobodyinc.com"
                    className="underline underline-offset-2 hover:text-[#c62828] transition-colors"
                    itemProp="email"
                  >
                    {t('company.email')}
                  </a>
                </p>
              </div>
            </address>

            <div className="mt-4">
              <p className="text-[11px] text-[#a0a0a0] uppercase tracking-widest mb-2">
                {t('followUs')}
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/prestigeautobodyinc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('social.instagramAria')}
                  className="text-gray-400 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c62828] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A] rounded-sm"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/prestigeautobodysilverspring/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('social.facebookAria')}
                  className="text-gray-400 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c62828] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A] rounded-sm"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@prestigeautobodyinc649"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('social.youtubeAria')}
                  className="text-gray-400 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c62828] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A] rounded-sm"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
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
            <p className="text-xs text-[#a0a0a0]">
              {t('copyright', { year: currentYear })}
            </p>
            <nav
              aria-label="Legal links"
              className="flex items-center gap-4 sm:gap-6"
            >
              <Link
                href="/privacy-policy"
                className="text-xs text-[#a0a0a0] underline underline-offset-2 hover:text-[#c62828] transition-colors"
              >
                {t('legal.privacy')}
              </Link>
              <Link
                href="/terms-of-service"
                className="text-xs text-[#a0a0a0] underline underline-offset-2 hover:text-[#c62828] transition-colors"
              >
                {t('legal.terms')}
              </Link>
              <NextLink
                href="/sitemap.xml"
                className="text-xs text-[#a0a0a0] underline underline-offset-2 hover:text-[#c62828] transition-colors"
              >
                {t('legal.sitemap')}
              </NextLink>
            </nav>
          </div>
          <p className="mt-4 text-center text-[10px] text-[#a0a0a0] tracking-wide">
            {t('builtBy')}{' '}
            <a
              href="https://ibudi.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline underline-offset-2 hover:text-[#c62828] transition-colors"
            >
              ibudi.dev
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
