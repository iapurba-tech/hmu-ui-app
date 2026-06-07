import { apiClient } from "../../apiClient";
import { API_ENDPOINTS } from "../../endpoints";
import type {
  MilkCollection,
  MilkCollectionCreateRequest,
  MilkCollectionUpdateRequest,
  PaginatedResponse,
} from "../../../../features/unit-operations/milk-collections/types/milk-collection.types";

export const milkCollectionsApi = {
  list: async (page = 0, size = 10, sort?: string) => {
    const response = await apiClient.get<PaginatedResponse<MilkCollection>>(
      API_ENDPOINTS.ADMIN.MILK_COLLECTION.LIST,
      {
        params: { page, size, sort },
      },
    );
    return response.data;
  },

  create: async (
    data: MilkCollectionCreateRequest | MilkCollectionCreateRequest[],
  ) => {
    const payload = Array.isArray(data) ? data : [data];
    const response = await apiClient.post<MilkCollection | MilkCollection[]>(
      API_ENDPOINTS.ADMIN.MILK_COLLECTION.CREATE,
      payload,
    );
    return response.data;
  },

  update: async (id: string, data: MilkCollectionUpdateRequest) => {
    const response = await apiClient.put<MilkCollection>(
      API_ENDPOINTS.ADMIN.MILK_COLLECTION.UPDATE(id),
      data,
    );
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(API_ENDPOINTS.ADMIN.MILK_COLLECTION.DELETE(id));
  },
};
