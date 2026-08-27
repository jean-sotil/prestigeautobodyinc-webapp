import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './src/i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // Normalize non-www → www (single redirect, then continue to i18n routing)
  if (host.startsWith('prestigeautobodyinc.com') && !host.startsWith('www')) {
    return NextResponse.redirect(
      new URL(
        `https://www.prestigeautobodyinc.com${pathname}${request.nextUrl.search}`,
        request.url,
      ),
      308,
    );
  }

  // Handle root path for www domain → route to i18n (next-intl will handle locale detection)
  if (pathname === '/' && host.includes('www.prestigeautobodyinc.com')) {
    // Let next-intl middleware handle locale routing from root
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
