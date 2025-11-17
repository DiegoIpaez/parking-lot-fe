import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { clearAuthCookieServer } from '@/app/actions/auth.action';
import { LOCAL_STORAGE_KEYS } from '@/constants';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (token, user) => {
        set({ token, user, isAuthenticated: true });
      },
      logout: () => {
        clearAuthCookieServer();
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: LOCAL_STORAGE_KEYS.AUTH_STORAGE,
    }
  )
);
