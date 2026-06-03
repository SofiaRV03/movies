import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
const COOKIE_NAME = 'session';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isStatic =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/img/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/data/');

  if (isStatic) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (pathname === '/login') {
    if (token) {
      try {
        await jwtVerify(token, secret);
        return NextResponse.redirect(new URL('/', request.url));
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/auth/login') || pathname.startsWith('/api/auth/register')) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const session = payload as { userId: number; email: string; role: string };

    if (
      (pathname.startsWith('/base-de-datos') || pathname.startsWith('/registrar-pelicula') || pathname.startsWith('/editar-pelicula')) &&
      session.role !== 'ADMIN'
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api/auth/logout|api/auth/me|_next/static|_next/image|favicon.ico).*)',
  ],
};
