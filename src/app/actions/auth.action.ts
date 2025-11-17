'use server';

import { cookies } from 'next/headers';

export async function setAuthCookieServer(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
    path: '/',
  });
}

export async function clearAuthCookieServer() {
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
}
