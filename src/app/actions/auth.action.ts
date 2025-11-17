'use server';

import { cookies } from 'next/headers';
import { CONFIG, COOKIES, NodeEnv } from '@/constants';

export async function setAuthCookieServer(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(COOKIES.ACCESS_TOKEN, token, {
    httpOnly: true,
    secure: CONFIG.NODE_ENV === NodeEnv.Production,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
    path: '/',
  });
}

export async function clearAuthCookieServer() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIES.ACCESS_TOKEN);
}
