import { routing } from '@/i18n/routing';
import { PageHeroBanner } from '@/components/hero';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function CollisionRepairPage() {
  return (
    <div className="font-sans min-h-screen">
      <PageHeroBanner
        slug="collision-repair"
        alt="Professional collision repair technician using computerized frame measuring equipment with laser scanners and digital displays at Prestige Auto Body"
        title="Expert Collision Repair Services - Computerized Frame Measuring & PDR"
        heading="Collision Repair"
        subtitle="Professional collision repair services to restore your vehicle to pre-accident condition"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-lg text-(--text-secondary) leading-relaxed">
          Our certified technicians use the latest technology and techniques to
          ensure your vehicle is repaired to factory specifications. From
          computerized frame measuring to paintless dent repair, we deliver
          results that exceed expectations.
        </p>
      </main>
    </div>
  );
}
