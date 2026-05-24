import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
} from "../../../../features/admin/products/types/product.types";
import { apiClient } from "../../apiClient";
import { API_ENDPOINTS } from "../../endpoints";

export const productApi = {
  getProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(
      API_ENDPOINTS.ADMIN.PRODUCT.LIST,
    );
    return response.data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(
      API_ENDPOINTS.ADMIN.PRODUCT.DETAIL(id),
    );
    return response.data;
  },

  createProduct: async (data: CreateProductRequest): Promise<Product> => {
    const response = await apiClient.post<Product>(
      API_ENDPOINTS.ADMIN.PRODUCT.CREATE,
      data,
    );
    return response.data;
  },

  updateProduct: async ({
    id,
    ...data
  }: UpdateProductRequest): Promise<Product> => {
    const response = await apiClient.put<Product>(
      API_ENDPOINTS.ADMIN.PRODUCT.UPDATE(id),
      data,
    );
    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.ADMIN.PRODUCT.DELETE(id));
  },
};
