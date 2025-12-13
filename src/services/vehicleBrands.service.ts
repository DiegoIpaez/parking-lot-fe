import axios from '@/lib/axios';
import { GetResponse, ListQueryParams, VehicleBrand } from '@/types';

export const vehicleBrandsService = {
  getAll: async (
    params?: ListQueryParams
  ): Promise<GetResponse<VehicleBrand>> => {
    const { data } = await axios.get('/vehicle-brands', {
      params,
    });
    return data;
  },
};
