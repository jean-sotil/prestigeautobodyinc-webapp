import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * Services Page - Core Web Vitals Optimized
 *
 * Optimizations:
 * - Semantic HTML for SEO
 * - No render-blocking resources
 * - System fonts for fast text rendering
 * - Structured data ready
 */

export const metadata: Metadata = {
  title:
    'Auto Body Services | Collision Repair, Painting & Towing | Prestige Auto Body',
  description:
    'Complete auto body services including collision repair, professional painting, 24/7 towing, frame repair, and insurance claims assistance in Silver Spring, MD.',
  keywords: [
    'collision repair',
    'auto painting',
    'towing service',
    'frame repair',
    'insurance claims',
    'Silver Spring MD',
  ],
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Auto Body Services | Prestige Auto Body',
    description:
      'Complete collision repair, painting, and towing services in Silver Spring, MD.',
    url: '/services',
    type: 'website',
  },
};

const services = [
  {
    id: 'collision-repair',
    title: 'Collision Repair',
    description:
      'From minor fender benders to major collisions, our certified technicians restore your vehicle to pre-accident condition using state-of-the-art equipment and techniques.',
    features: [
      'I-CAR and ASE certified technicians',
      'Computerized frame straightening',
      'Factory-approved repair methods',
      'Complete structural restoration',
      'Detailed damage assessment',
    ],
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    id: 'auto-painting',
    title: 'Auto Painting',
    description:
      'Our professional painting services use PPG paint systems and computerized color matching to ensure a perfect factory finish every time.',
    features: [
      'Computerized color matching technology',
      'PPG premium paint systems',
      'Clear coat application',
      'Custom paint jobs available',
      'Lifetime paint warranty',
    ],
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
        />
      </svg>
    ),
  },
  {
    id: 'towing',
    title: '24/7 Towing',
    description:
      'Emergency towing and roadside assistance available around the clock. We offer overnight vehicle drop-off for your convenience.',
    features: [
      '24/7 emergency towing',
      'Roadside assistance',
      'Accident scene response',
      'Overnight vehicle drop-off',
      'Direct to shop delivery',
    ],
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: 'frame-repair',
    title: 'Frame Repair',
    description:
      'Computerized frame straightening and structural repairs to restore your vehicle to factory specifications.',
    features: [
      'Computerized frame measurement',
      'Structural realignment',
      'Unibody repair',
      'Factory specification restoration',
      'Post-repair inspections',
    ],
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
  {
    id: 'insurance-claims',
    title: 'Insurance Claims',
    description:
      'We work with all major insurance companies and handle the entire claims process for your convenience.',
    features: [
      'Direct insurance billing',
      'Claims processing assistance',
      'Rental car coordination',
      'Deductible assistance programs',
      'All major insurers accepted',
    ],
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.823 10.29 9 11.622 5.177-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.383-3.016z"
        />
      </svg>
    ),
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-red-900 to-red-800 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Our Services
          </h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto">
            Complete auto body and collision repair services for all vehicle
            makes and models
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                id={service.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow scroll-mt-20"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <div className="text-red-600 dark:text-red-400">
                      {service.icon}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {service.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
                    Features
                  </h3>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <svg
                          className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-400">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-900 to-red-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Contact us today for a free estimate or emergency towing service
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-red-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get a Free Quote
            </Link>
            <a
              href="tel:+13015885555"
              className="inline-flex items-center justify-center px-8 py-4 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors border border-red-600"
            >
              Call Now: (301) 588-5555
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
