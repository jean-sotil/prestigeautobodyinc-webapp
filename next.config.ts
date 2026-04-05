import type { NextConfig } from 'next';
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
    return [];
  },

  // Rewrites (if needed)
  async rewrites() {
    return [];
  },
};

// Wrap with both bundle analyzer and next-intl
const withNextIntl = createNextIntlPlugin();

// Wrap with bundle analyzer (enabled via ANALYZE=true env var)
const config = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(withNextIntl(nextConfig));

export default config;
