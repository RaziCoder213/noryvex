import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Pass through standard routes unchanged
  if (
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/login') ||
    url.pathname.startsWith('/forgot-password') ||
    url.pathname.startsWith('/reset-password') ||
    url.pathname.startsWith('/w/')
  ) {
    return NextResponse.next();
  }

  const hostname = request.headers.get('host');
  if (!hostname) {
    return NextResponse.next();
  }

  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'trynoryvex.com';

  let subdomain = '';

  if (hostname.includes('localhost')) {
    // Localhost: extract from sub.localhost:3000
    const parts = hostname.split('.');
    if (parts.length > 1 && parts[0] !== 'localhost') {
      subdomain = parts[0];
    }
  } else if (hostname.endsWith(`.${appDomain}`)) {
    subdomain = hostname.slice(0, hostname.length - appDomain.length - 1);
  }

  if (subdomain && subdomain !== 'www' && subdomain !== 'portal') {
    url.pathname = `/w/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
