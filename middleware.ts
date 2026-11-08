import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Instant Google Site Verification for Google Search Console HTML file method
  // Google asks users to verify ownership by requesting /google[code].html
  // and expects "google-site-verification: google[code].html" in the response body.
  const googleMatch = pathname.match(/^\/(google[a-zA-Z0-9_-]+)\.html$/i);
  if (googleMatch) {
    const filename = `${googleMatch[1]}.html`;
    return new NextResponse(`google-site-verification: ${filename}`, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and api routes
     */
    '/((?!_next/static|_next/image|assets|favicon.ico).*)',
  ],
};
