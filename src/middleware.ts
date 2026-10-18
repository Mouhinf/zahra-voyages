import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const lang = pathname.startsWith('/en') ? 'en' : 'fr';
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-slaac-locale', lang);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
