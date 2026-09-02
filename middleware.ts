import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './src/i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Enforce HTTPS (x-forwarded-proto is set by most hosting platforms)
  const protocol =
    request.headers.get('x-forwarded-proto') ||
    request.nextUrl.protocol.slice(0, -1);
  if (protocol === 'http') {
    const host = request.headers.get('host');
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
