import { USER_COOKIES_STORAGE_KEY } from '@/constants/keys';
import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  const user = request.cookies.get(USER_COOKIES_STORAGE_KEY)?.value;
  const signInUrl = new URL('/', request.url);
  const dashboardUrl = new URL('/dashboard', request.url);
  if (!user) {
    if (['/', '/sign-up'].includes(request.nextUrl.pathname)) {
      return NextResponse.next();
    }
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.redirect(signInUrl);
  }
  const parsedUser = JSON.parse(user)
  if(!Number(parsedUser.ativado)) {
    if (request.nextUrl.pathname === '/dashboard/products') {
      return NextResponse.next();
    }
    if (request.nextUrl.pathname.startsWith('/dashboard/products')) {
      return NextResponse.redirect(dashboardUrl+'?error=not_subscription');
    }
    if (request.nextUrl.pathname.startsWith('/dashboard/integrations')) {
      return NextResponse.redirect(dashboardUrl+'?error=not_subscription');
    }
  }
  if (['/', '/sign-up'].includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(dashboardUrl);
  }
}

export const config = {
  matcher: ['/', '/sign-up', '/dashboard/:path*'],
};
