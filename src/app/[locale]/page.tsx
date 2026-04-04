import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function HomePage() {
  const t = useTranslations('home');
  const nav = useTranslations('nav');
  const common = useTranslations('common');

  return (
    <div className="font-sans min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Prestige Auto Body Inc.
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/collision-repair"
                className="text-gray-700 hover:text-gray-900"
              >
                {nav('collisionRepair')}
              </Link>
              <Link
                href="/auto-painting"
                className="text-gray-700 hover:text-gray-900"
              >
                {nav('autoPainting')}
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-gray-900"
              >
                {nav('contact')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-4">{t('hero.subtitle')}</p>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            {t('hero.description')}
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
            >
              {t('hero.ctaPrimary')}
            </Link>
            <Link
              href="/gallery"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              {t('hero.ctaSecondary')}
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('services.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">
                {t('services.collision.title')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('services.collision.description')}
              </p>
              <Link
                href="/collision-repair"
                className="text-blue-600 hover:underline"
              >
                {common('learnMore')}
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">
                {t('services.painting.title')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('services.painting.description')}
              </p>
              <Link
                href="/auto-painting"
                className="text-blue-600 hover:underline"
              >
                {common('learnMore')}
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">
                {t('services.towing.title')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('services.towing.description')}
              </p>
              <Link href="/towing" className="text-blue-600 hover:underline">
                {common('learnMore')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('whyChooseUs.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('whyChooseUs.experience.title')}
              </h3>
              <p className="text-gray-600">
                {t('whyChooseUs.experience.description')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('whyChooseUs.certified.title')}
              </h3>
              <p className="text-gray-600">
                {t('whyChooseUs.certified.description')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t('whyChooseUs.insurance.title')}
              </h3>
              <p className="text-gray-600">
                {t('whyChooseUs.insurance.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-lg mb-8">{t('cta.description')}</p>
          <Link
            href="/contact"
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition inline-block"
          >
            {t('cta.button')}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Prestige Auto Body Inc.
              </h3>
              <p className="text-gray-400">
                © 2026 Prestige Auto Body Inc. All rights reserved.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">Phone: (555) 123-4567</p>
              <p className="text-gray-400">Email: info@prestigeautobody.com</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
              <p className="text-gray-400">Mon - Fri: 8:00 AM - 6:00 PM</p>
              <p className="text-gray-400">Sat: 9:00 AM - 2:00 PM</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
