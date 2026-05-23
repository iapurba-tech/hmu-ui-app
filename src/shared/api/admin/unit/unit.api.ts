import type { Unit } from "../../../features/admin/units/types/unit.types";
import { apiClient } from "../../apiClient";
import { API_ENDPOINTS } from "../../endpoints";

export const unitApi = {
  getAllUnits: async (): Promise<Unit[]> => {
    const response = await apiClient.get<Unit[]>(API_ENDPOINTS.ADMIN.UNIT.LIST);
    return response.data;
  },

  createUnit: async (unitData: Partial<Unit>): Promise<Unit> => {
    const response = await apiClient.post<Unit>(
      API_ENDPOINTS.ADMIN.UNIT.CREATE,
      unitData,
    );
    return response.data;
  },

  updateUnit: async ({
    id,
    ...unitData
  }: Partial<Unit> & { id: string }): Promise<Unit> => {
    const response = await apiClient.put<Unit>(
      `${API_ENDPOINTS.ADMIN.UNIT.LIST}/${id}`,
      unitData,
    );
    return response.data;
  },

  activateUnit: async (id: string): Promise<void> => {
    await apiClient.patch(API_ENDPOINTS.ADMIN.UNIT.ACTIVATE(id));
  },

  deactivateUnit: async (id: string): Promise<void> => {
    await apiClient.patch(API_ENDPOINTS.ADMIN.UNIT.DEACTIVATE(id));
  },
};
