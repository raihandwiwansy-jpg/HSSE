import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  if (pathname === '/') {
    return NextResponse.next();
  }

  const isPublic = pathname === '/login' || pathname === '/' || pathname === '/forgot-password';

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isPublic && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Role-based route protection (read from cookie/localStorage not available in middleware)
  // We handle role-based access in the frontend components instead
  // Middleware only checks authentication (token existence)

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico|.*\\.).*)'],
};
