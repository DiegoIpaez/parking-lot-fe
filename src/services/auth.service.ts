import axiosClient from '@/lib/axios';
import type { LoginRequest, LoginResponse } from '@/types';

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const { data: responseData } = await axiosClient.post('/auth/login', data);
    return responseData;
  },
};
