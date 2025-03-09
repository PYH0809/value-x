import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/stock';
    url.searchParams.set('code', '600519');
    url.searchParams.set('tab', 'qa');
    url.searchParams.set('pageNum', '1');
    url.searchParams.set('market', 'SH');
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/',
};
