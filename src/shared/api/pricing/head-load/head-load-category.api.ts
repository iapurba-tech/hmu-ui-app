import type {
  HeadLoadCategory,
  CreateHeadLoadCategoryRequest,
  UpdateHeadLoadCategoryRequest,
} from "../../../../features/pricing/head-loads/types/head-load-category.types";
import { apiClient } from "../../apiClient";
import { API_ENDPOINTS } from "../../endpoints";

export const headLoadCategoryApi = {
  getHeadLoadCategories: async (): Promise<HeadLoadCategory[]> => {
    const response = await apiClient.get<HeadLoadCategory[]>(
      API_ENDPOINTS.PRICING.HEAD_LOAD_CATEGORY.LIST,
    );
    return response.data;
  },

  createHeadLoadCategory: async (
    data: CreateHeadLoadCategoryRequest,
  ): Promise<HeadLoadCategory> => {
    const response = await apiClient.post<HeadLoadCategory>(
      API_ENDPOINTS.PRICING.HEAD_LOAD_CATEGORY.CREATE,
      data,
    );
    return response.data;
  },

  updateHeadLoadCategory: async ({
    id,
    ...data
  }: UpdateHeadLoadCategoryRequest): Promise<HeadLoadCategory> => {
    const response = await apiClient.put<HeadLoadCategory>(
      API_ENDPOINTS.PRICING.HEAD_LOAD_CATEGORY.UPDATE(id),
      data,
    );
    return response.data;
  },

  deleteHeadLoadCategory: async (id: number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PRICING.HEAD_LOAD_CATEGORY.DELETE(id));
  },
};
