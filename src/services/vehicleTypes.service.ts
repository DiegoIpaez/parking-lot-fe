import axios from '@/lib/axios';
import type { GetResponse, ListQueryParams, VehicleType } from '@/types';

type CreateVehicleTypePayload = Omit<
  VehicleType,
  'id' | 'createdAt' | 'updatedAt'
>;

type UpdateVehicleTypePayload = Partial<CreateVehicleTypePayload>;

export const vehicleTypesService = {
  getAll: async (
    params: ListQueryParams = {}
  ): Promise<GetResponse<VehicleType>> => {
    const { data } = await axios.get('/vehicle-types', {
      params,
    });
    return data;
  },
  create: async (payload: CreateVehicleTypePayload): Promise<VehicleType> => {
    const { data } = await axios.post('/vehicle-types', payload);
    return data;
  },
  update: async (
    id: number,
    payload: UpdateVehicleTypePayload
  ): Promise<VehicleType> => {
    const { data } = await axios.put(`/vehicle-types/${id}`, payload);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await axios.delete(`/vehicle-types/${id}`);
  },
};
