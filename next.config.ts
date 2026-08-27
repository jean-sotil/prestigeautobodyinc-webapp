import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';
import withBundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // Core Web Vitals Optimizations

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
  async redirects() {
    return [
      // Canonical domain: consolidate non-www → www.prestigeautobodyinc.com
      // Catch-all for any path on non-www domain
      {
        source: '/:path*',
        destination: 'https://www.prestigeautobodyinc.com/:path*',
        permanent: true,
        has: [{ type: 'host', value: 'prestigeautobodyinc.com' }],
      },
      // www root without locale → /en
      {
        source: '/',
        destination: '/en',
        permanent: true,
        has: [{ type: 'host', value: 'www.prestigeautobodyinc.com' }],
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
      {
        source: '/about-Nosotros',
        destination: '/en/about',
        permanent: true,
      },
      {
        source: '/about-Servicios',
        destination: '/en/auto-body-services',
        permanent: true,
      },
      {
        source: '/collision-repair-Collision',
        destination: '/en/collision-repair',
        permanent: true,
      },
      {
        source: '/auto-painting-Pintura',
        destination: '/en/auto-painting',
        permanent: true,
      },
      {
        source: '/insurance-claims-Seguro',
        destination: '/en/insurance-claims',
        permanent: true,
      },
      {
        source: '/insurance-claims-Insurance',
        destination: '/en/insurance-claims',
        permanent: true,
      },
      {
        source: '/get-a-quote-Cotizaci%C3%B3n',
        destination: '/en/get-a-quote',
        permanent: true,
      },
      // Legacy WordPress/old-site routes
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
      // Blog cross-locale slug fixes (Spanish slug served under /en/)
      {
        source: '/en/blog/partes-oem-vs-aftermarket-explicado',
        destination: '/es/blog/oem-vs-aftermarket-parts-collision-repair',
        permanent: true,
      },
      {
        source: '/en/blog/partes-oem-vs-aftermarket-reparacion-colision',
        destination: '/es/blog/oem-vs-aftermarket-parts-collision-repair',
        permanent: true,
      },
      {
        source: '/blog/partes-oem-vs-aftermarket-reparacion-colision',
        destination: '/es/blog/oem-vs-aftermarket-parts-collision-repair',
        permanent: true,
      },
      {
        source: '/en/blog/que-es-un-suplemento-de-carroceria',
        destination: '/es/blog/que-es-un-suplemento-de-carroceria',
        permanent: true,
      },
      {
        source: '/es/blog/oem-vs-aftermarket-parts-explained',
        destination: '/es/blog/oem-vs-aftermarket-parts-collision-repair',
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
