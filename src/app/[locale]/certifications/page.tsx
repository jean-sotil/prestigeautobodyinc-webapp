import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function CertificationsPage() {
  const t = useTranslations('nav');
  const nav = useTranslations('nav');

  return (
    <div className="font-sans min-h-screen">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Prestige Auto Body Inc.
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-700 hover:text-gray-900">
                {nav('home')}
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-gray-900"
              >
                {nav('contact')}
              </Link>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6">{t('certifications')}</h1>
        <p className="text-lg text-gray-600">
          Our technicians hold I-CAR and ASE certifications, ensuring that your
          vehicle is repaired by qualified professionals who follow industry
          best practices and safety standards.
        </p>
      </main>
    </div>
  );
}
