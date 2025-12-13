import axios from '@/lib/axios';
import type { GetResponse, ListQueryParams, ParkingSpace } from '@/types';

export const parkingSpacesService = {
  getBySector: async (sectorId: number): Promise<GetResponse<ParkingSpace>> => {
    const { data } = await axios.get('/parking-spaces', {
      params: { sectorId },
    });
    return data;
  },
  getAll: async (
    params: ListQueryParams
  ): Promise<GetResponse<ParkingSpace>> => {
    const { data } = await axios.get('/parking-spaces', {
      params,
    });
    return data;
  },
};
