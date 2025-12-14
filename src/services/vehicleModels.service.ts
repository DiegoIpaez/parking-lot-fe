import axios from '@/lib/axios';
import { GetResponse, ListQueryParams, VehicleModel } from '@/types';

export const vehicleModelsService = {
  getAll: async (
    params?: ListQueryParams
  ): Promise<GetResponse<VehicleModel>> => {
    const { data } = await axios.get('/vehicle-models', {
      params,
    });
    return data;
  },
};
