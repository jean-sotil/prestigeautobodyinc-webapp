import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';
import withBundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';

// The `Redirect` exported from 'next' is a different (looser) type than the one
// `NextConfig['redirects']` actually expects, so derive the exact element type.
type NextRedirect = Awaited<
  ReturnType<NonNullable<NextConfig['redirects']>>
>[number];

const nextConfig: NextConfig = {
  // Core Web Vitals Optimizations

  // Remove trailing slashes for canonical URLs (consolidates duplicate impressions)
  // /en/contact/ → /en/contact, /es/nosotros/ → /es/nosotros
  trailingSlash: false,

  // Disable production source maps for max performance (reduces bundle size)
  productionBrowserSourceMaps: false,

  // Enable React Strict Mode for development best practices
  reactStrictMode: true,

  // Enable experimental features for Core Web Vitals optimization
  experimental: {
    // Optimize package imports for common libraries (reduces bundle size)
    optimizePackageImports: ['react', 'react-dom', 'lucide-react', 'zod'],
  },

  // Webpack optimization — rely on Next.js built-in chunk splitting
  // (custom splitChunks overrides can inflate first-load JS per route)
  webpack: (config, { dev }) => {
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };
    }

    return config;
  },

  // Image optimization for LCP improvement
  images: {
    // Use modern formats for smaller file sizes
    formats: ['image/webp', 'image/avif'],
    // Allow remote images from any HTTPS source
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Cap responsive variants at 1920 — 2048/3840 cost real bytes on mobile
    // and the largest design surface on this site is ~1600px wide.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
    // Minimum cache TTL (30 days)
    minimumCacheTTL: 2592000,
    qualities: [75, 90],
  },

  // Compression (gzip/brotli) for faster transfer
  compress: true,

  // Disable powered by header for security
  poweredByHeader: false,

  // Headers for Core Web Vitals optimization
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            // Enable browser resource hints
            key: 'Accept-CH',
            value: 'DPR, Width, Viewport-Width',
          },
        ],
      },
      {
        // Prevent search engines from indexing static assets
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache JavaScript and CSS files
        source: '/:all*.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*.css',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects (if needed)
  //
  // NOTE: keep this list static. Payload's config is ESM-only (`import.meta`),
  // while next.config.ts is transpiled to CJS and `require()`d, so querying the
  // CMS from here cannot work. Cross-locale blog slug redirects are issued at
  // request time by src/app/(frontend)/[locale]/blog/[slug]/page.tsx instead.
  async redirects(): Promise<NextRedirect[]> {
    const staticRedirects: NextRedirect[] = [
      // Canonical domain: consolidate non-www → www + locale in ONE redirect
      // Root path on non-www → www.prestigeautobodyinc.com/en (direct, no chain)
      {
        source: '/',
        destination: 'https://www.prestigeautobodyinc.com/en',
        permanent: true,
        has: [{ type: 'host', value: 'prestigeautobodyinc.com' }],
      },
      // All other paths: non-www → www.prestigeautobodyinc.com
      {
        source: '/:path*',
        destination: 'https://www.prestigeautobodyinc.com/:path*',
        permanent: true,
        has: [{ type: 'host', value: 'prestigeautobodyinc.com' }],
      },
      // www root without locale → /en (middleware handles this, but keep as fallback)
      {
        source: '/',
        destination: '/en',
        permanent: true,
        has: [{ type: 'host', value: 'www.prestigeautobodyinc.com' }],
      },
      // Trailing slash consolidation: /path/ → /path
      // Merges duplicate impressions from URLs with/without trailing slash
      // Applied AFTER locale/domain redirects so /en/contact/ → /en/contact
      {
        source: '/:locale/:path+/',
        destination: '/:locale/:path+',
        permanent: true,
      },
      // Legacy URLs with trailing slashes (no locale prefix)
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
      // Route renames: paint-solutions → auto-painting
      {
        source: '/:locale/paint-solutions',
        destination: '/:locale/auto-painting',
        permanent: true,
      },
      // Route renames: insurance → insurance-claims
      {
        source: '/:locale/insurance',
        destination: '/:locale/insurance-claims',
        permanent: true,
      },
      // ===== Legacy 404 fixes: old bilingual URL patterns =====
      // CRITICAL: Add non-www versions FIRST to avoid redirect chains
      // These go DIRECTLY to final destination (single 301, not multi-hop)
      {
        source: '/insurance-claims-Seguro',
        destination: 'https://www.prestigeautobodyinc.com/en/insurance-claims',
        permanent: true,
        has: [{ type: 'host', value: 'prestigeautobodyinc.com' }],
      },
      {
        source: '/get-a-quote-Cotización',
        destination: 'https://www.prestigeautobodyinc.com/en/get-a-quote',
        permanent: true,
        has: [{ type: 'host', value: 'prestigeautobodyinc.com' }],
      },
      {
        source: '/collision-repair-Collision',
        destination: 'https://www.prestigeautobodyinc.com/en/collision-repair',
        permanent: true,
        has: [{ type: 'host', value: 'prestigeautobodyinc.com' }],
      },
      {
        source: '/about-Nosotros',
        destination: 'https://www.prestigeautobodyinc.com/en/about',
        permanent: true,
        has: [{ type: 'host', value: 'prestigeautobodyinc.com' }],
      },
      {
        source: '/auto-painting-Pintura',
        destination: 'https://www.prestigeautobodyinc.com/en/auto-painting',
        permanent: true,
        has: [{ type: 'host', value: 'prestigeautobodyinc.com' }],
      },
      {
        source: '/about-Servicios',
        destination:
          'https://www.prestigeautobodyinc.com/en/auto-body-services',
        permanent: true,
        has: [{ type: 'host', value: 'prestigeautobodyinc.com' }],
      },
      // www bilingual URLs (URL-encoded version for Cotización)
      {
        source: '/insurance-claims-Seguro',
        destination: '/en/insurance-claims',
        permanent: true,
      },
      {
        source: '/get-a-quote-Cotizaci%C3%B3n',
        destination: '/en/get-a-quote',
        permanent: true,
      },
      {
        source: '/collision-repair-Collision',
        destination: '/en/collision-repair',
        permanent: true,
      },
      {
        source: '/about-Nosotros',
        destination: '/en/about',
        permanent: true,
      },
      {
        source: '/auto-painting-Pintura',
        destination: '/en/auto-painting',
        permanent: true,
      },
      {
        source: '/about-Servicios',
        destination: '/en/auto-body-services',
        permanent: true,
      },
      {
        source: '/insurance-claims-Insurance',
        destination: '/en/insurance-claims',
        permanent: true,
      },
      // Legacy WordPress/old-site routes
      // Direct non-www URLs to avoid chains
      {
        source: '/es/prestige-auto-body-collision-automotive-repair/:path*',
        destination: 'https://www.prestigeautobodyinc.com/es',
        permanent: true,
        has: [{ type: 'host', value: 'prestigeautobodyinc.com' }],
      },
      {
        source: '/en/body-services/:path*',
        destination:
          'https://www.prestigeautobodyinc.com/en/auto-body-services',
        permanent: true,
        has: [{ type: 'host', value: 'prestigeautobodyinc.com' }],
      },
      {
        source: '/es/body-services/:path*',
        destination:
          'https://www.prestigeautobodyinc.com/es/auto-body-services',
        permanent: true,
        has: [{ type: 'host', value: 'prestigeautobodyinc.com' }],
      },
      // www versions (locale-aware)
      {
        source: '/es/prestige-auto-body-collision-automotive-repair/:path*',
        destination: '/es',
        permanent: true,
      },
      {
        source: '/:locale/body-services',
        destination: '/:locale/auto-body-services',
        permanent: true,
      },
      // Unlocalized Spanish blog slugs → /es/. MUST precede the catch-all below,
      // which would otherwise send them to /en/ and force a second redirect.
      {
        source: '/blog/partes-oem-vs-aftermarket-explicado',
        destination: '/es/blog/partes-oem-vs-aftermarket-explicado',
        permanent: true,
      },
      {
        source: '/blog/partes-oem-vs-aftermarket-reparacion-colision',
        destination: '/es/blog/partes-oem-vs-aftermarket-reparacion-colision',
        permanent: true,
      },
      {
        source: '/blog/que-es-un-suplemento-de-carroceria',
        destination: '/es/blog/que-es-un-suplemento-de-carroceria',
        permanent: true,
      },
      // Catch-all: unlocalized blog paths → /en/blog/:slug (fixes URLs without locale prefix)
      {
        source: '/blog/:slug+',
        destination: '/en/blog/:slug+',
        permanent: true,
      },
      // Blog cross-locale slug fixes: a slug belonging to the other locale, served
      // under this one. The destination stays in the REQUESTED locale and only
      // corrects the slug — same rule the runtime resolver in
      // blog/[slug]/page.tsx applies. That resolver already covers every post;
      // these entries exist so the URLs Google has already indexed resolve in a
      // single hop without waking the app.
      {
        source: '/en/blog/partes-oem-vs-aftermarket-explicado',
        destination: '/en/blog/oem-vs-aftermarket-parts-explained',
        permanent: true,
      },
      {
        source: '/en/blog/partes-oem-vs-aftermarket-reparacion-colision',
        destination: '/en/blog/oem-vs-aftermarket-parts-collision-repair',
        permanent: true,
      },
      {
        source: '/en/blog/que-es-un-suplemento-de-carroceria',
        destination: '/en/blog/what-is-an-auto-body-supplement',
        permanent: true,
      },
      {
        source: '/es/blog/oem-vs-aftermarket-parts-explained',
        destination: '/es/blog/partes-oem-vs-aftermarket-explicado',
        permanent: true,
      },
      {
        source: '/es/blog/oem-vs-aftermarket-parts-collision-repair',
        destination: '/es/blog/partes-oem-vs-aftermarket-reparacion-colision',
        permanent: true,
      },
      {
        source: '/es/blog/what-is-an-auto-body-supplement',
        destination: '/es/blog/que-es-un-suplemento-de-carroceria',
        permanent: true,
      },
      // Malformed URL
      {
        source: '/$',
        destination: '/en',
        permanent: true,
      },
      // WordPress legacy routes (prevent 5xx errors)
      {
        source: '/wp-admin/:path*',
        destination: '/en',
        permanent: true,
      },
      {
        source: '/wp-includes/:path*',
        destination: '/en',
        permanent: true,
      },
      {
        source: '/wp-content/:path*',
        destination: '/en',
        permanent: true,
      },
    ];

    return staticRedirects;
  },

  // Rewrites: map localized Spanish slugs to internal English paths
  async rewrites() {
    return [
      {
        source: '/es/servicios-de-carroceria',
        destination: '/es/auto-body-services',
      },
      {
        source: '/es/reparacion-de-colisiones',
        destination: '/es/collision-repair',
      },
      { source: '/es/pintura-de-autos', destination: '/es/auto-painting' },
      { source: '/es/remolque', destination: '/es/towing' },
      { source: '/es/reclamos-de-seguro', destination: '/es/insurance-claims' },
      {
        source: '/es/asistencia-de-alquiler',
        destination: '/es/rental-assistance',
      },
      { source: '/es/nosotros', destination: '/es/about' },
      { source: '/es/nuestro-equipo', destination: '/es/our-team' },
      { source: '/es/certificaciones', destination: '/es/certifications' },
      { source: '/es/contacto', destination: '/es/contact' },
      { source: '/es/ubicaciones', destination: '/es/locations' },
      { source: '/es/galeria', destination: '/es/gallery' },
      { source: '/es/obtener-cotizacion', destination: '/es/get-a-quote' },
      {
        source: '/es/politica-de-privacidad',
        destination: '/es/privacy-policy',
      },
      {
        source: '/es/terminos-de-servicio',
        destination: '/es/terms-of-service',
      },
      {
        source: '/es/lavado-y-detallado',
        destination: '/es/car-wash-detailing',
      },
    ];
  },
};

// Wrap with both bundle analyzer and next-intl
const withNextIntl = createNextIntlPlugin();

// Wrap with bundle analyzer (enabled via ANALYZE=true env var)
const analyzedConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(withNextIntl(nextConfig));

// Wrap with Payload CMS
export default withPayload(analyzedConfig);
