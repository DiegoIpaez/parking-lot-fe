import axios from 'axios';
import { CONFIG, LOCAL_STORAGE_KEYS } from '@/constants';

const api = axios.create({
  baseURL: CONFIG.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const authStorage = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_STORAGE);
    const data = authStorage ? JSON.parse(authStorage) : null;
    if (!data) return config;

    const token = data?.state?.token;
    if (!token) return config;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
