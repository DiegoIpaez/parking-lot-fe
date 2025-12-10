import axios from '@/lib/axios';
import type { GetResponse, PaginationParams, User, UserRole } from '@/types';

export type CreateUserRequest = Pick<
  User,
  'firstName' | 'lastName' | 'email' | 'role' | 'isActive'
> & {
  password?: string;
};

export type UpdateUserRequest = Partial<CreateUserRequest>;

export type UserFilters = PaginationParams & {
  role?: UserRole | null;
  isActive?: boolean | null;
};

export const usersService = {
  getAll: async (): Promise<GetResponse<User>> => {
    const { data } = await axios.get('/users');
    return data;
  },
  getById: async (id: number): Promise<User> => {
    const { data } = await axios.get(`/users/${id}`);
    return data;
  },
  create: async (payload: CreateUserRequest): Promise<User> => {
    const { data } = await axios.post('/users', payload);
    return data;
  },
  update: async (id: number, payload: UpdateUserRequest): Promise<User> => {
    const { data } = await axios.put(`/users/${id}`, payload);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await axios.delete(`/users/${id}`);
  },
};
