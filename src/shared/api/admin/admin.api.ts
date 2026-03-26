import type { Unit } from "../../../features/admin/types/unit.types";
import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../endpoints";

export const adminApi = {
  getAllUnits: async (): Promise<Unit[]> => {
    const response = await apiClient.get<Unit[]>(API_ENDPOINTS.ADMIN.UNIT.LIST);
    return response.data;
  },
};
