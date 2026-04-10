import {
  OptimizedImage,
  HeroImage,
  CardImage,
  GalleryImage,
} from '@/components/ui/Image';
import {
  PhoneIcon,
  EmailIcon,
  LocationIcon,
  WrenchIcon,
  ShieldIcon,
  AwardIcon,
} from '@/components/ui/Icons';

/**
 * Image Optimization Demo Page
 *
 * Demonstrates best practices for optimized images:
 * - WebP/AVIF format negotiation via next/image
 * - Responsive srcset with sizes attribute
 * - Priority loading for LCP (Largest Contentful Paint)
 * - Lazy loading for off-screen images
 * - Explicit width/height to prevent CLS
 * - SVG icons as React components (no HTTP requests)
 */
export default function ImageOptimizationDemo() {
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-16">
      {/* Header */}
      <section>
        <h1 className="text-3xl font-bold mb-4">Image Optimization Pipeline</h1>
        <p className="text-gray-600 dark:text-gray-400">
          This page demonstrates Next.js image optimization best practices. All
          images use the Next.js Image component with automatic format
          negotiation, responsive sizing, and proper accessibility.
        </p>
      </section>

      {/* Hero Image Section - LCP Optimized */}
      <section className="border-t pt-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-green-600">✓</span>
          Hero Image (Priority Loading for LCP)
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Hero images use the <code>priority</code> prop for preloading. This
          ensures the Largest Contentful Paint (LCP) element loads immediately
          without delay.
        </p>
        <div className="relative h-[400px] w-full rounded-lg overflow-hidden bg-gray-100">
          {/* Placeholder for hero image - in production, use actual image */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full" />
              <p>Hero Image Placeholder</p>
              <p className="text-sm">
                priority= true | sizes=&quot;100vw&quot;
              </p>
            </div>
          </div>
          {/* Example usage commented out until real images are available:
          <HeroImage
            src="/images/hero-shop.jpg"
            alt="Prestige Auto Body shop exterior with modern facility"
            width={1200}
            height={600}
            className="h-[400px]"
          />
          */}
        </div>
      </section>

      {/* Service Cards with Images */}
      <section className="border-t pt-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-green-600">✓</span>
          Service Cards (Responsive Images)
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Service card images use responsive srcset with sizes attribute. Mobile
          gets full-width images, desktop gets smaller grid images.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: WrenchIcon,
              title: 'Collision Repair',
              desc: 'Expert collision repair services',
            },
            {
              icon: ShieldIcon,
              title: 'Certified Work',
              desc: 'I-CAR certified technicians',
            },
            {
              icon: AwardIcon,
              title: 'Quality Paint',
              desc: 'Factory-matched paint finishes',
            },
          ].map((service, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              {/* Placeholder for card image */}
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <service.icon size={48} className="text-gray-400" />
              </div>
              {/* Example: <CardImage src={`/images/service-${i}.jpg`} alt={service.title} /> */}
              <div className="p-4">
                <h3 className="font-semibold">{service.title}</h3>
                <p className="text-sm text-gray-500">{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="border-t pt-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-green-600">✓</span>
          Gallery Grid (Lazy Loading)
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Gallery images below the fold use lazy loading. They only load when
          the user scrolls near them, reducing initial page weight.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center"
            >
              <span className="text-gray-400">Gallery Image {i}</span>
              {/* Example: <GalleryImage src={`/images/gallery-${i}.jpg`} alt={`Repair work ${i}`} /> */}
            </div>
          ))}
        </div>
      </section>

      {/* SVG Icons Section */}
      <section className="border-t pt-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-green-600">✓</span>
          SVG Icons (Inlined Components)
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          All icons are inlined as React components. No separate HTTP requests,
          instant rendering, and fully accessible with aria-labels.
        </p>
        <div className="flex flex-wrap gap-8 items-center">
          <div className="flex items-center gap-2">
            <PhoneIcon className="text-blue-600" />
            <span className="text-sm">Phone</span>
          </div>
          <div className="flex items-center gap-2">
            <EmailIcon className="text-blue-600" />
            <span className="text-sm">Email</span>
          </div>
          <div className="flex items-center gap-2">
            <LocationIcon className="text-blue-600" />
            <span className="text-sm">Location</span>
          </div>
          <div className="flex items-center gap-2">
            <WrenchIcon className="text-blue-600" />
            <span className="text-sm">Services</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldIcon className="text-blue-600" />
            <span className="text-sm">Certified</span>
          </div>
        </div>
      </section>

      {/* Technical Implementation Notes */}
      <section className="border-t pt-8 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Implementation Details</h2>
        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">1.</span>
            <span>
              <strong>Next.js Image Component:</strong> All images use{' '}
              <code>next/image</code> for automatic WebP/AVIF format
              negotiation, responsive srcset generation, and lazy loading.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">2.</span>
            <span>
              <strong>Priority Loading:</strong> Hero/above-fold images use the{' '}
              <code>priority</code> prop to preload and improve LCP (Largest
              Contentful Paint).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">3.</span>
            <span>
              <strong>Explicit Dimensions:</strong> All images have explicit
              width/height to prevent Cumulative Layout Shift (CLS) during
              loading.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">4.</span>
            <span>
              <strong>Responsive Sizes:</strong> The <code>sizes</code>{' '}
              attribute tells the browser which image size to download based on
              viewport width.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">5.</span>
            <span>
              <strong>SVG Icons:</strong> All icons are React components with
              proper aria-labels. No HTTP requests, instant rendering.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">6.</span>
            <span>
              <strong>Alt Text:</strong> Every image has descriptive alt text
              for accessibility and SEO.
            </span>
          </li>
        </ul>

        <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded border">
          <h3 className="font-semibold mb-2">Usage Example:</h3>
          <pre className="text-xs overflow-x-auto">
            <code>{`import { HeroImage, CardImage } from '@/components/ui/Image';

// Hero image (priority loading for LCP)
<HeroImage
  src="/images/hero.jpg"
  alt="Auto body shop exterior"
  width={1200}
  height={600}
  className="h-[400px]"
/>

// Card image (responsive, lazy loaded)
<CardImage
  src="/images/service.jpg"
  alt="Collision repair process"
/>`}</code>
          </pre>
        </div>
      </section>
    </main>
  );
}
