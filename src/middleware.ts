import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log(request.nextUrl);
  // const { pathname } = request.nextUrl;

  // if (pathname === '/') {
  //   const url = request.nextUrl.clone();
  //   url.pathname = '/stock';
  //   // ?code=600519&tab=qa&pageNum=1&market=SH
  //   url.searchParams.set('code', '600519');
  //   url.searchParams.set('tab', 'qa');
  //   url.searchParams.set('pageNum', '1');
  //   url.searchParams.set('market', 'SH');
  //   return NextResponse.redirect(url);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: '/',
};
