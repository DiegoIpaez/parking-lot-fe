import axios from '@/lib/axios';
import { GetResponse, ListQueryParams, Sector } from '@/types';

export const sectorsService = {
  getAll: async (
    params: ListQueryParams = {}
  ): Promise<GetResponse<Sector>> => {
    const { data } = await axios.get('/sectors', {
      params,
    });
    return data;
  },
};
