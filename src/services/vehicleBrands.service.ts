import axios from '@/lib/axios';
import { GetResponse, PaginationParams, VehicleBrand } from '@/types';

export const vehicleBrandsService = {
  getAll: async (
    params?: PaginationParams
  ): Promise<GetResponse<VehicleBrand>> => {
    const { data } = await axios.get('/vehicle-brands', {
      params,
    });
    return data;
  },
};
