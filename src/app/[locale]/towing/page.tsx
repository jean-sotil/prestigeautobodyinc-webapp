import { routing } from '@/i18n/routing';
import { PageHeroBanner } from '@/components/hero';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function TowingPage() {
  return (
    <div className="font-sans min-h-screen">
      <PageHeroBanner
        slug="towing-24-7"
        alt="Professional flatbed tow truck providing 24/7 emergency roadside assistance and towing services at night with amber emergency lights"
        title="24/7 Emergency Towing & Roadside Assistance in Silver Spring, MD"
        heading="24/7 Towing"
        subtitle="Emergency towing services available when you need us most"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
          Our professional tow truck operators are ready to assist you around
          the clock, ensuring your vehicle is safely transported to our
          facility. Available 24 hours a day, 7 days a week.
        </p>
      </main>
    </div>
  );
}
