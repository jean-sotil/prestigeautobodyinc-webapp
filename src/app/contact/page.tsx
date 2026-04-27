import type { Metadata } from 'next';
import { QuoteForm } from '@/components/forms/QuoteForm';
import { GoogleMapEmbed } from '@/components/embeds/GoogleMapEmbed';

/**
 * Contact Page - Core Web Vitals Optimized
 *
 * Optimizations:
 * - Semantic HTML for accessibility
 * - System fonts for fast text rendering
 * - Form component with proper validation
 * - Lazy loaded map component
 */

export const metadata: Metadata = {
  title: 'Contact Us | Prestige Auto Body | Silver Spring, MD',
  description:
    'Contact Prestige Auto Body for collision repair, auto painting, and towing services. Free estimates. Located at 928 Philadelphia Avenue, Silver Spring, MD.',
  keywords: [
    'contact auto body shop',
    'collision repair estimate',
    'Silver Spring auto body',
    'towing service contact',
  ],
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Prestige Auto Body | Silver Spring, MD',
    description:
      'Get a free estimate for collision repair, auto painting, and towing services.',
    url: '/contact',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-red-900 to-red-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto">
            Get a free estimate or schedule service. We&apos;re here to help
            with all your auto body needs.
          </p>
        </div>
      </section>

      {/* Contact Information Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Phone */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Call Us
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Mon-Fri: 8AM - 6PM
                <br />
                Emergency towing available 24/7
              </p>
              <a
                href="tel:+13015885555"
                className="text-red-600 dark:text-red-400 font-semibold hover:underline text-lg"
              >
                (301) 588-5555
              </a>
            </div>

            {/* Address */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Visit Us
              </h3>
              <address className="not-italic text-gray-600 dark:text-gray-400 mb-4">
                928 Philadelphia Avenue
                <br />
                Silver Spring, MD 20910
              </address>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Free parking available
              </p>
            </div>

            {/* Email */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Email Us
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                For questions and estimates
                <br />
                Response within 24 hours
              </p>
              <a
                href="mailto:info@prestigeautobody.com"
                className="text-red-600 dark:text-red-400 font-semibold hover:underline"
              >
                info@prestigeautobody.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Request a Free Quote
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Fill out the form and we&apos;ll get back to you within 24 hours
                with a detailed estimate for your auto body needs.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-green-600"
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
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Free, no-obligation estimates
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-green-600"
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
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Direct insurance billing
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-green-600"
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
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Lifetime warranty on repairs
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <GoogleMapEmbed
              address="928 Philadelphia Avenue, Silver Spring, MD 20910"
              title="Prestige Auto Body Location"
              zoom={16}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
