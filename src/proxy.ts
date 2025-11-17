import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { CONFIG } from './constants';

export async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(CONFIG.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  try {
    const token = req.cookies.get('access_token');

    if (!token) throw new Error('Token no proporcionado');
    const isValidToken = await verifyToken(token.value);
    if (!isValidToken) throw new Error('Token inválido');

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/', '/admin/:path*'],
};
