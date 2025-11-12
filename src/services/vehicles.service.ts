import axios from "@/lib/axios";
import type { GetResponse, Vehicle } from "@/types";

export const vehiclesService = {
  getAll: async (): Promise<GetResponse<Vehicle>> => {
    const { data } = await axios.get("/vehicles", {
      params: { showAll: true },
    });
    return data;
  },
};
