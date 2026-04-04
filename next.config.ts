import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  // Enable production source maps for debugging (can be disabled for max performance)
  productionBrowserSourceMaps: false,

  // Enable experimental features for optimization
  experimental: {
    // Optimize package imports for common libraries
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

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Compression
  compress: true,

  // Powered by header (disable for security)
  poweredByHeader: false,
};

// Wrap with bundle analyzer (enabled via ANALYZE=true env var)
const config = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);

export default config;
