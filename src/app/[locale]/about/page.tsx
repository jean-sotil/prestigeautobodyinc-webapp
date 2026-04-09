import { routing } from '@/i18n/routing';
import { PageHeroBanner } from '@/components/hero';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function AboutPage() {
  return (
    <div className="font-sans min-h-screen">
      <PageHeroBanner
        slug="auto-body-services"
        alt="Comprehensive auto body services including dent repair, structural frame work, bumper repair, alloy wheel restoration, glass replacement and spray painting"
        title="Full-Service Auto Body Repair - Dent Repair, Structural Work, Paint & More"
        heading="Auto Body Services"
        subtitle="Over 20 years of professional auto body repair services"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
          Prestige Auto Body Inc. has been serving the community for over 20
          years with professional auto body repair services. Our commitment to
          quality workmanship and customer satisfaction has made us a trusted
          name in the industry.
        </p>
      </main>
    </div>
  );
}
