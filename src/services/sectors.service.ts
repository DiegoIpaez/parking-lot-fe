import axios from '@/lib/axios';
import { GetResponse, Sector } from '@/types';

export const sectorsService = {
  getAll: async (): Promise<GetResponse<Sector>> => {
    const { data } = await axios.get('/sectors', {
      params: { showAll: true },
    });
    return data;
  },
};
