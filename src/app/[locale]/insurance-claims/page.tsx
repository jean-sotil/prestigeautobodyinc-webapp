import { routing } from '@/i18n/routing';
import { PageHeroBanner } from '@/components/hero';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function InsuranceClaimsPage() {
  return (
    <div className="font-sans min-h-screen">
      <PageHeroBanner
        slug="insurance-claims"
        alt="Professional insurance claims advisor reviewing documentation with satisfied customer at Prestige Auto Body consultation area"
        title="Insurance Claims Assistance - We Handle Your Paperwork"
        heading="Insurance Claims"
        subtitle="We work directly with all major insurance companies to streamline your claims process"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
          Our experienced team handles the paperwork and negotiations, making
          your repair experience as smooth as possible. We accept all major
          insurance carriers and submit claims on your behalf.
        </p>
      </main>
    </div>
  );
}
