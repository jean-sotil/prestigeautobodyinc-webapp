import { routing } from '@/i18n/routing';
import { PageHeroBanner } from '@/components/hero';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function AutoPaintingPage() {
  return (
    <div className="font-sans min-h-screen">
      <PageHeroBanner
        slug="paint-solutions"
        alt="Advanced computerized paint color matching and formulation facility with downdraft paint booth and eco-friendly refinishing technology"
        title="Premium Paint Solutions - Computerized Color Matching & Eco-Friendly Refinishing"
        heading="Paint Solutions"
        subtitle="Professional auto painting with precision color matching and premium finishes"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
          We use high-quality paint and clear coat to ensure a durable,
          showroom-quality finish that lasts for years. Our computerized color
          matching system and downdraft paint booth deliver factory-perfect
          results with eco-friendly refinishing technology.
        </p>
      </main>
    </div>
  );
}
