'use client';

/**
 * Dynamic Import Demo Page
 *
 * This page demonstrates best practices for code splitting:
 * - Dynamic imports for heavy components
 * - Loading skeletons with accessibility
 * - Named imports for tree shaking
 */

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { FormSkeleton, EmbedSkeleton } from '@/components/ui/Skeleton';

// Dynamically imported components (lazy loaded)
const QuoteForm = dynamic(
  () => import('@/components/forms/QuoteForm').then((mod) => mod.QuoteForm),
  {
    ssr: false, // Client-only component
    loading: () => <FormSkeleton />,
  },
);

const YouTubeEmbed = dynamic(
  () =>
    import('@/components/embeds/YouTubeEmbed').then((mod) => mod.YouTubeEmbed),
  {
    loading: () => <EmbedSkeleton aspectRatio="video" />,
  },
);

const GoogleMapEmbed = dynamic(
  () =>
    import('@/components/embeds/GoogleMapEmbed').then(
      (mod) => mod.GoogleMapEmbed,
    ),
  {
    loading: () => <EmbedSkeleton aspectRatio="square" />,
  },
);

export default function DynamicImportsDemo() {
  return (
    <main className="max-w-4xl mx-auto p-6 space-y-12">
      {/* Header */}
      <section>
        <h1 className="text-3xl font-bold mb-4">
          Code Splitting & Dynamic Imports
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          This page demonstrates Next.js code splitting patterns. Heavy
          components are loaded on-demand, reducing the initial JavaScript
          bundle size.
        </p>
      </section>

      {/* Quote Form Section */}
      <section className="border-t pt-8">
        <h2 className="text-xl font-semibold mb-4">
          Get a Quote (Dynamic Form)
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          The quote form is dynamically imported and loads only when this page
          is visited.
        </p>
        <Suspense fallback={<FormSkeleton />}>
          <QuoteForm />
        </Suspense>
      </section>

      {/* YouTube Section */}
      <section className="border-t pt-8">
        <h2 className="text-xl font-semibold mb-4">
          Video Gallery (Lazy Loaded)
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          YouTube embed uses a facade pattern - heavy iframe loads only on
          click.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <Suspense fallback={<EmbedSkeleton aspectRatio="video" />}>
            <YouTubeEmbed
              videoId="dQw4w9WgXcQ"
              title="Auto Body Repair Process"
            />
          </Suspense>
          <Suspense fallback={<EmbedSkeleton aspectRatio="video" />}>
            <YouTubeEmbed
              videoId="aqz-KE-bpKQ"
              title="Paint Matching Technology"
            />
          </Suspense>
        </div>
      </section>

      {/* Map Section */}
      <section className="border-t pt-8">
        <h2 className="text-xl font-semibold mb-4">
          Find Us (Static Map Facade)
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Maps component loads with a static image facade, reducing initial
          load.
        </p>
        <Suspense fallback={<EmbedSkeleton aspectRatio="square" />}>
          <GoogleMapEmbed
            address="928 Philadelphia Avenue, Silver Spring, MD 20910"
            title="Prestige Auto Body Location"
          />
        </Suspense>
      </section>

      {/* Technical Notes */}
      <section className="border-t pt-8 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Implementation Notes</h2>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>
              <strong>Dynamic Imports:</strong> Heavy components use{' '}
              <code>next/dynamic</code> for automatic code splitting
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>
              <strong>Loading States:</strong> All dynamic components have
              accessible skeleton loaders with aria-busy and aria-label
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>
              <strong>Facade Pattern:</strong> YouTube uses a lightweight
              thumbnail until user interaction triggers full embed
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>
              <strong>Tree Shaking:</strong> Named exports ensure unused code is
              eliminated from the bundle
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>
              <strong>Route Splitting:</strong> Each page loads only its
              required code thanks to Next.js App Router
            </span>
          </li>
        </ul>
      </section>
    </main>
  );
}
