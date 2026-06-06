import { apiClient } from "../../apiClient";
import { API_ENDPOINTS } from "../../endpoints";
import type {
  Mpcs,
  MpcsCreateRequest,
  MpcsDetailsRequest,
  MpcsConfigurationRequest,
} from "../../../../features/unit-operations/mpcs/types/mpcs.types";

export const mpcsApi = {
  list: async () => {
    const response = await apiClient.get<Mpcs[]>(API_ENDPOINTS.ADMIN.MPCS.LIST);
    return response.data;
  },

  get: async (id: string) => {
    const response = await apiClient.get<Mpcs>(
      API_ENDPOINTS.ADMIN.MPCS.DETAIL(id),
    );
    return response.data;
  },

  create: async (data: MpcsCreateRequest) => {
    const response = await apiClient.post<Mpcs>(
      API_ENDPOINTS.ADMIN.MPCS.CREATE,
      data,
    );
    return response.data;
  },

  updateDetails: async (id: string, data: MpcsDetailsRequest) => {
    const response = await apiClient.put<Mpcs>(
      API_ENDPOINTS.ADMIN.MPCS.UPDATE_DETAILS(id),
      data,
    );
    return response.data;
  },

  updateConfiguration: async (id: string, data: MpcsConfigurationRequest) => {
    const response = await apiClient.patch<Mpcs>(
      API_ENDPOINTS.ADMIN.MPCS.UPDATE_CONFIGURATION(id),
      data,
    );
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(API_ENDPOINTS.ADMIN.MPCS.DELETE(id));
  },
};
