import axios from '@/lib/axios';
import type {
  GetResponse,
  ListQueryParams,
  Vehicle,
  CreateVehicleRequest,
  UpdateVehicleRequest,
} from '@/types';

export const vehiclesService = {
  getAll: async (
    params: {
      notParked?: boolean;
    } & ListQueryParams = {}
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
  getById: async (id: number): Promise<Vehicle> => {
    const { data } = await axios.get(`/vehicles/${id}`);
    return data;
  },
  create: async (data: CreateVehicleRequest): Promise<Vehicle> => {
    const { data: responseData } = await axios.post('/vehicles', data);
    return responseData;
  },
  update: async (id: number, data: UpdateVehicleRequest): Promise<Vehicle> => {
    const { data: responseData } = await axios.put(`/vehicles/${id}`, data);
    return responseData;
  },
  delete: async (id: number): Promise<void> => {
    await axios.delete(`/vehicles/${id}`);
  },
};
