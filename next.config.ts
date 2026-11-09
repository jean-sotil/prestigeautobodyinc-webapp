import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';
import withBundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';

// The `Redirect` exported from 'next' is a different (looser) type than the one
// `NextConfig['redirects']` actually expects, so derive the exact element type.
type NextRedirect = Awaited<
  ReturnType<NonNullable<NextConfig['redirects']>>
>[number];

// English slug → proposed Spanish slug for the 15 ES posts that still store the
// English string as their Spanish slug. Keep in sync with
// .agents/tasks/es-slug-mapping.md (owner-approved before the CMS change).
const ES_UNTRANSLATED_SLUG_MAP: Record<string, string> = {
  'protect-car-paint-from-sun-damage': 'proteger-pintura-auto-dano-solar',
  'document-car-accident-insurance-claim':
    'como-documentar-accidente-auto-seguro',
  'ev-collision-repair-specialist':
    'reparacion-colisiones-vehiculos-electricos-especialista',
  'rental-car-coverage-during-repairs-guide':
    'guia-cobertura-auto-alquiler-durante-reparaciones',
  'minor-collision-hidden-damage-inspection':
    'choque-leve-dano-oculto-inspeccion-profesional',
  'hail-damage-repair-guide': 'guia-reparacion-danos-por-granizo',
  'car-paint-repair-myths': 'mitos-reparacion-pintura-auto',
  'adas-recalibration-windshield-replacement':
    'recalibracion-adas-reemplazo-parabrisas',
  'collision-vs-comprehensive-insurance-guide':
    'seguro-colision-vs-cobertura-amplia',
  'how-to-read-auto-body-estimate': 'como-leer-estimado-carroceria',
  'aluminum-vs-steel-body-repair': 'reparacion-carroceria-aluminio-vs-acero',
  'adas-recalibration-after-collision':
    'recalibracion-adas-despues-de-colision',
  'what-is-car-insurance-deductible': 'que-es-deducible-seguro-auto',
  'what-to-do-after-car-accident': 'que-hacer-despues-de-accidente-auto',
  'right-to-choose-auto-body-shop': 'derecho-a-elegir-taller-carroceria',
};

const ES_UNTRANSLATED_SLUG_REDIRECTS: NextRedirect[] = Object.entries(
  ES_UNTRANSLATED_SLUG_MAP,
).map(([english, spanish]) => ({
  source: `/es/blog/${english}`,
  destination: `/es/blog/${spanish}`,
  permanent: true,
}));

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
      // All other paths: non-www → www.prestigeautobodyinc.com
      // www root without locale → /en (middleware handles this, but keep as fallback)
      {
        source: '/',
        destination: '/en',
        permanent: true,
        has: [{ type: 'host', value: 'www.prestigeautobodyinc.com' }],
      },
      // Root fallback for all other hosts (localhost, Vercel preview URLs,
      // the bare apex). Without this, `/` has no handler: with
      // `localePrefix: 'always'` nothing renders the unprefixed root, so the
      // locale layout that carries <html>/<body> is never reached and Next
      // throws "Missing <html> and <body> tags". The host-scoped rule above
      // only fires on the production www host, so it can't cover dev/preview.
      {
        source: '/',
        destination: '/en',
        permanent: false,
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
      // Route renames. One rule per locale, each pointing at the PUBLIC slug:
      // a shared `/:locale/...` rule sent Spanish URLs to the internal English
      // route (/es/auto-painting), which next-intl then redirected again to
      // /es/pintura-de-autos — two hops instead of one.
      // paint-solutions → auto-painting
      {
        source: '/en/paint-solutions',
        destination: '/en/auto-painting',
        permanent: true,
      },
      {
        source: '/es/paint-solutions',
        destination: '/es/pintura-de-autos',
        permanent: true,
      },
      // insurance → insurance-claims
      {
        source: '/en/insurance',
        destination: '/en/insurance-claims',
        permanent: true,
      },
      {
        source: '/es/insurance',
        destination: '/es/reclamos-de-seguro',
        permanent: true,
      },
      // ===== Legacy 404 fixes: old bilingual URL patterns =====
      // CRITICAL: Add non-www versions FIRST to avoid redirect chains
      // These go DIRECTLY to final destination (single 301, not multi-hop)
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
        source: '/get-a-quote-Cotización',
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
      // www versions (locale-aware)
      {
        source: '/es/prestige-auto-body-collision-automotive-repair/:path*',
        destination: '/es',
        permanent: true,
      },
      {
        source: '/en/body-services/:path*',
        destination: '/en/auto-body-services',
        permanent: true,
      },
      {
        source: '/es/body-services/:path*',
        destination: '/es/servicios-de-carroceria',
        permanent: true,
      },
      // ── Unlocalized blog slugs (no /en or /es prefix) ────────────────
      // These MUST precede the /blog/:slug+ catch-all below, which would
      // otherwise send them all to /en/ and force a second redirect.
      // Slugs of retired duplicates go straight to the canonical post.
      {
        source: '/blog/oem-vs-aftermarket-parts-explained',
        destination: '/en/blog/oem-vs-aftermarket-parts-collision-repair',
        permanent: true,
      },
      {
        source: '/blog/partes-oem-vs-aftermarket-explicado',
        destination: '/es/blog/partes-oem-vs-aftermarket-reparacion-colision',
        permanent: true,
      },
      {
        source: '/blog/right-to-choose-repair-shop',
        destination: '/en/blog/right-to-choose-auto-body-shop',
        permanent: true,
      },
      // Spanish slugs belong under /es/, not the /en/ catch-all:
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
      {
        source: '/blog/que-hacer-estimado-seguro-muy-bajo',
        destination: '/es/blog/que-hacer-estimado-seguro-muy-bajo',
        permanent: true,
      },
      {
        source: '/blog/taller-carroceria-vs-mecanico-senales',
        destination: '/es/blog/taller-carroceria-vs-mecanico-senales',
        permanent: true,
      },
      // Catch-all: remaining unlocalized blog paths → /en/blog/:slug
      {
        source: '/blog/:slug+',
        destination: '/en/blog/:slug+',
        permanent: true,
      },
      // ── Consolidated duplicate posts ─────────────────────────────────
      // Archived in the CMS in favour of one canonical article per query
      // (they were competing with each other in search). Keep these for as
      // long as the retired URLs hold inbound links or index presence.
      {
        source: '/en/blog/oem-vs-aftermarket-parts-explained',
        destination: '/en/blog/oem-vs-aftermarket-parts-collision-repair',
        permanent: true,
      },
      {
        source: '/es/blog/partes-oem-vs-aftermarket-explicado',
        destination: '/es/blog/partes-oem-vs-aftermarket-reparacion-colision',
        permanent: true,
      },
      {
        source: '/en/blog/right-to-choose-repair-shop',
        destination: '/en/blog/right-to-choose-auto-body-shop',
        permanent: true,
      },
      {
        source: '/es/blog/right-to-choose-repair-shop',
        destination: '/es/blog/right-to-choose-auto-body-shop',
        permanent: true,
      },
      // ── Blog cross-locale slug fixes ─────────────────────────────────
      // A slug belonging to the other locale, served under this one. The
      // destination stays in the REQUESTED locale and only corrects the slug
      // — the same rule the runtime resolver in blog/[slug]/page.tsx applies.
      // That resolver covers every post; these entries exist so URLs Google
      // has already indexed resolve in a single hop without waking the app.
      // Where the slug belonged to a retired duplicate, they point straight
      // at the canonical post so there is still only one hop.
      {
        source: '/en/blog/partes-oem-vs-aftermarket-explicado',
        destination: '/en/blog/oem-vs-aftermarket-parts-collision-repair',
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
        destination: '/es/blog/partes-oem-vs-aftermarket-reparacion-colision',
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
      // Renamed posts: the old English-slug URL under /es was indexed by
      // Google and now 404s. Single-hop 301 to the Spanish slug.
      {
        source: '/es/blog/what-to-do-insurance-estimate-too-low',
        destination: '/es/blog/que-hacer-estimado-seguro-muy-bajo',
        permanent: true,
      },
      {
        source: '/es/blog/body-shop-vs-mechanic-signs',
        destination: '/es/blog/taller-carroceria-vs-mecanico-senales',
        permanent: true,
      },
      // Posts whose Spanish slug is still the English string in the CMS.
      // Proposed slugs: .agents/tasks/es-slug-mapping.md. These are 301s, so
      // they MUST NOT be live until the CMS slugs are translated, otherwise
      // the 200 pages currently indexed would turn into 404s. Opt-in only.
      ...(process.env.ENABLE_ES_BLOG_SLUG_REDIRECTS === 'true'
        ? ES_UNTRANSLATED_SLUG_REDIRECTS
        : []),
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
