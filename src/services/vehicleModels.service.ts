import axios from '@/lib/axios';
import { GetResponse, PaginationParams, VehicleModel } from '@/types';

export const vehicleModelsService = {
  getAll: async (
    params?: PaginationParams
  ): Promise<GetResponse<VehicleModel>> => {
    const { data } = await axios.get('/vehicle-models', {
      params,
    });
    return data;
  },
};
