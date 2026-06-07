import { apiClient } from "../../apiClient";
import { API_ENDPOINTS } from "../../endpoints";
import type {
  ProductSale,
  ProductSaleCreateRequest,
  ProductSaleUpdateRequest,
  ProductSalePaginatedResponse,
  ProductSaleFilters,
} from "../../../../features/unit-operations/sales/types/product-sale.types";

export const productSalesApi = {
  list: async (
    page = 0,
    size = 10,
    sort?: string,
    filters?: ProductSaleFilters,
  ) => {
    const response = await apiClient.get<ProductSalePaginatedResponse>(
      API_ENDPOINTS.ADMIN.PRODUCT_SALE.LIST,
      {
        params: {
          page,
          size,
          sort,
          ...filters,
        },
      },
    );
    return response.data;
  },

  create: async (
    data: ProductSaleCreateRequest | ProductSaleCreateRequest[],
  ) => {
    const payload = Array.isArray(data) ? data : [data];
    const response = await apiClient.post<ProductSale | ProductSale[]>(
      API_ENDPOINTS.ADMIN.PRODUCT_SALE.CREATE,
      payload,
    );
    return response.data;
  },

  update: async (id: string, data: ProductSaleUpdateRequest) => {
    const response = await apiClient.put<ProductSale>(
      API_ENDPOINTS.ADMIN.PRODUCT_SALE.UPDATE(id),
      data,
    );
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(API_ENDPOINTS.ADMIN.PRODUCT_SALE.DELETE(id));
  },
};
