import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './src/i18n/routing';

const handleI18nRouting = createMiddleware(routing);

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);

function isLocalHost(host: string | null): boolean {
  if (!host) return false;
  const hostname = host.replace(/:\d+$/, '');
  return LOCAL_HOSTS.has(hostname) || hostname.endsWith('.local');
}

export default function middleware(request: NextRequest) {
  // Enforce HTTPS, but only when a proxy has actually told us the scheme.
  // A missing x-forwarded-proto means we are not behind a TLS-terminating
  // proxy (local `next start`, direct container access), and redirecting
  // there sends the browser to an https:// port nothing is listening on.
  // Do NOT fall back to nextUrl.protocol — it is always http in those cases.
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const host = request.headers.get('host');
  if (forwardedProto === 'http' && !isLocalHost(host)) {
    return NextResponse.redirect(
      `https://${host}${request.nextUrl.pathname}${request.nextUrl.search}`,
      308,
    );
  }

  const response = handleI18nRouting(request);

  // next-intl always issues 307 for its locale/pathname redirects, even
  // though locale-prefix and localized-slug resolution is deterministic
  // per URL (not user/context dependent). Search Console's redirect
  // validation stays Pending/Failed on 307s since they're not treated as
  // permanent — upgrade to 308 so these canonicalize as expected.
  const location = response.headers.get('location');
  if (response.status === 307 && location) {
    return NextResponse.redirect(new URL(location, request.url), 308);
  }

  return response;
}

export const config = {
  // Match all pathnames except for
  // - /api routes
  // - /admin (Payload CMS admin panel)
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - /static (inside /public)
  // - all root files inside /public (e.g. /favicon.ico)
  matcher: ['/((?!api|admin|_next|_vercel|static|.*\\..*).*)'],
};
