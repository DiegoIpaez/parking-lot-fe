import axios from "@/lib/axios";
import type {
  ParkingSession,
  CreateParkingSessionRequest,
  CompleteParkingSessionRequest,
  ParkingSessionFilters,
  GetResponse,
} from "@/types";

export const parkingSessionsService = {
  getAll: async (
    filters?: ParkingSessionFilters
  ): Promise<GetResponse<ParkingSession>> => {
    const params: ParkingSessionFilters = {};

    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;
    if (filters?.vehicleLicensePlate)
      params.vehicleLicensePlate = filters.vehicleLicensePlate;
    if (filters?.status) params.status = filters.status;

    const { data } = await axios.get("/parking-sessions", {
      params,
    });
    return data;
  },

  getById: async (id: number): Promise<ParkingSession> => {
    const { data } = await axios.get(`/parking-sessions/${id}`);
    return data;
  },

  create: async (
    data: CreateParkingSessionRequest
  ): Promise<ParkingSession> => {
    const { data: responseData } = await axios.post("/parking-sessions", data);
    return responseData;
  },

  complete: async (
    id: number,
    data: CompleteParkingSessionRequest
  ): Promise<ParkingSession> => {
    const { data: responseData } = await axios.put(
      `/parking-sessions/${id}`,
      data
    );
    return responseData;
  },
};
