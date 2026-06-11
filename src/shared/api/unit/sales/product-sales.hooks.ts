import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productSalesApi } from "./product-sales.api";
import { useNotificationStore } from "../../../store/useNotificationStore";
import { useAuthStore } from "../../../store/useAuthStore";
import type {
  ProductSaleCreateRequest,
  ProductSaleUpdateRequest,
  ProductSaleFilters,
} from "../../../../features/unit-operations/sales/types/product-sale.types";

export const PRODUCT_SALE_KEYS = {
  all: ["product-sales"] as const,
  lists: (unitId?: string) =>
    [...PRODUCT_SALE_KEYS.all, "list", { unitId }] as const,
};

export const useGetProductSales = (
  page = 0,
  size = 10,
  sort?: string,
  filters?: ProductSaleFilters,
) => {
  const { activeUnit } = useAuthStore();

  return useQuery({
    queryKey: [
      ...PRODUCT_SALE_KEYS.lists(activeUnit?.id),
      { page, size, sort, ...filters },
    ],
    queryFn: () => productSalesApi.list(page, size, sort, filters),
    enabled: !!activeUnit?.id,
  });
};

export const useCreateProductSale = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationStore();
  const { activeUnit } = useAuthStore();

  return useMutation({
    mutationFn: (data: ProductSaleCreateRequest) =>
      productSalesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PRODUCT_SALE_KEYS.lists(activeUnit?.id),
      });
      showNotification("Product sale recorded successfully", "success");
    },
    onError: () => {
      showNotification("Failed to record product sale", "error");
    },
  });
};

export const useCreateProductSalesBulk = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationStore();
  const { activeUnit } = useAuthStore();

  return useMutation({
    mutationFn: (data: ProductSaleCreateRequest[]) =>
      productSalesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PRODUCT_SALE_KEYS.lists(activeUnit?.id),
      });
      showNotification("All product sales recorded successfully", "success");
    },
    onError: () => {
      showNotification("Failed to record product sales", "error");
    },
  });
};

export const useUpdateProductSale = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationStore();
  const { activeUnit } = useAuthStore();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ProductSaleUpdateRequest;
    }) => productSalesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PRODUCT_SALE_KEYS.lists(activeUnit?.id),
      });
      showNotification("Product sale updated successfully", "success");
    },
    onError: () => {
      showNotification("Failed to update product sale", "error");
    },
  });
};

export const useDeleteProductSale = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationStore();
  const { activeUnit } = useAuthStore();

  return useMutation({
    mutationFn: (id: string) => productSalesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PRODUCT_SALE_KEYS.lists(activeUnit?.id),
      });
      showNotification("Product sale deleted successfully", "success");
    },
    onError: () => {
      showNotification("Failed to delete product sale", "error");
    },
  });
};
