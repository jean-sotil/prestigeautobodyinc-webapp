import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function InsuranceClaimsPage() {
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
        <h1 className="text-3xl font-bold mb-6">{t('insuranceClaims')}</h1>
        <p className="text-lg text-gray-600">
          We work directly with all major insurance companies to streamline your
          claims process. Our experienced team handles the paperwork and
          negotiations, making your repair experience as smooth as possible.
        </p>
      </main>
    </div>
  );
}
