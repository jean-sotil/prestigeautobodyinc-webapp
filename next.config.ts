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
    optimizePackageImports: ['react', 'react-dom'],
  },

  // Webpack optimization
  webpack: (config, { isServer }) => {
    // Tree shaking: ensure unused exports are removed
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false,
    };

    // Split chunks configuration for better caching
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // Vendor chunk for node_modules
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            reuseExistingChunk: true,
          },
          // Common chunk for shared code
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
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
    ];
  },

  // Rewrites: map localized Spanish slugs to internal English paths
  async rewrites() {
    return [
      { source: '/es/servicios-de-carroceria', destination: '/es/auto-body-services' },
      { source: '/es/reparacion-de-colisiones', destination: '/es/collision-repair' },
      { source: '/es/pintura-de-autos', destination: '/es/auto-painting' },
      { source: '/es/remolque', destination: '/es/towing' },
      { source: '/es/reclamos-de-seguro', destination: '/es/insurance-claims' },
      { source: '/es/asistencia-de-alquiler', destination: '/es/rental-assistance' },
      { source: '/es/nosotros', destination: '/es/about' },
      { source: '/es/nuestro-equipo', destination: '/es/our-team' },
      { source: '/es/certificaciones', destination: '/es/certifications' },
      { source: '/es/contacto', destination: '/es/contact' },
      { source: '/es/ubicaciones', destination: '/es/locations' },
      { source: '/es/galeria', destination: '/es/gallery' },
      { source: '/es/obtener-cotizacion', destination: '/es/get-a-quote' },
      { source: '/es/politica-de-privacidad', destination: '/es/privacy-policy' },
      { source: '/es/terminos-de-servicio', destination: '/es/terms-of-service' },
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
