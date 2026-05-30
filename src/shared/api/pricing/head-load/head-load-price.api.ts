import { apiClient } from "../../apiClient";
import { API_ENDPOINTS } from "../../endpoints";
import type {
  HeadLoadPrice,
  CreateHeadLoadPriceRequest,
} from "../../../../features/pricing/head-loads/types/head-load-price.types";

export const headLoadPriceApi = {
  getAllHeadLoadPrices: async (): Promise<HeadLoadPrice[]> => {
    const response = await apiClient.get<HeadLoadPrice[]>(
      API_ENDPOINTS.PRICING.HEAD_LOAD.LIST,
    );
    return response.data;
  },

  getHeadLoadPrices: async (categoryId: number): Promise<HeadLoadPrice[]> => {
    const response = await apiClient.get<HeadLoadPrice[]>(
      API_ENDPOINTS.PRICING.HEAD_LOAD.BY_CATEGORY(categoryId),
    );
    return response.data;
  },

  createHeadLoadPrice: async (
    data: CreateHeadLoadPriceRequest,
  ): Promise<HeadLoadPrice> => {
    const response = await apiClient.post<HeadLoadPrice>(
      API_ENDPOINTS.PRICING.RULE.CREATE,
      data,
    );
    return response.data;
  },
};
