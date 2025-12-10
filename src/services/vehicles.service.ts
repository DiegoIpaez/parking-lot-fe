import axios from '@/lib/axios';
import type {
  GetResponse,
  PaginationParams,
  Vehicle,
  CreateVehicleRequest,
} from '@/types';

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

  create: async (data: CreateVehicleRequest): Promise<Vehicle> => {
    const { data: responseData } = await axios.post('/vehicles', data);
    return responseData;
  },
};
