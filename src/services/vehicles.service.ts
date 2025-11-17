import axios from '@/lib/axios';
import type { GetResponse, PaginationParams, Vehicle } from '@/types';

export const vehiclesService = {
  getAll: async (
    params: {
      notParked?: boolean;
    } & PaginationParams
  ): Promise<GetResponse<Vehicle>> => {
    const { data } = await axios.get('/vehicles', {
      params,
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    });
    return data;
  },
};
