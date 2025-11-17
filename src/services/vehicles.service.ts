import axios from '@/lib/axios';
import type {
  GetResponse,
  PaginationParams,
  Vehicle,
  CreateVehicleRequest,
  VehicleType,
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

export const vehicleTypesService = {
  getAll: async (): Promise<GetResponse<VehicleType>> => {
    const { data } = await axios.get('/vehicle-types', {
      params: { showAll: true },
    });
    return data;
  },
};
