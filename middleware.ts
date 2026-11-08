import { NextResponse, type NextRequest } from 'next/server';

// Verified Google Search Console verification token for aveezahvaganza.com
const GOOGLE_VERIFICATION_TOKEN = 'googlea1e44ba7053273f9';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Exact Google Search Console HTML verification file handler.
  // Google security bots test random filenames; returning 200 on bogus files triggers
  // Google's anti-cloaking/anti-hack detection. We strictly match only the owner's valid token.
  if (pathname === `/${GOOGLE_VERIFICATION_TOKEN}.html`) {
    return new NextResponse(`google-site-verification: ${GOOGLE_VERIFICATION_TOKEN}.html`, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match exact verification file or regular paths except static assets
     */
    '/googlea1e44ba7053273f9.html',
  ],
};
