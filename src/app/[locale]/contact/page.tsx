import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function ContactPage() {
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
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6">{t('contact')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-4">
              Ready to get started? Contact us today for a free estimate on your
              vehicle repair.
            </p>
            <div className="space-y-2">
              <p>
                <strong>Phone:</strong> (555) 123-4567
              </p>
              <p>
                <strong>Email:</strong> info@prestigeautobody.com
              </p>
              <p>
                <strong>Address:</strong> 123 Main Street, City, State 12345
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Business Hours</h2>
            <div className="space-y-2">
              <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
              <p>Saturday: 9:00 AM - 2:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
