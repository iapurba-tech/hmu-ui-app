import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { Product } from "../../../../features/admin/products/types/product.types";
import { productApi } from "./product.api";

export const productKeys = {
  all: ["products"] as const,
};

export const useGetProducts = (
  options?: Omit<
    UseQueryOptions<Product[], Error, Product[], readonly string[]>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: productApi.getProducts,
    staleTime: 1000 * 60 * 30,
    ...options,
  });
};

export const useGetProduct = (id: string) => {
  return useQuery({
    queryKey: [...productKeys.all, id],
    queryFn: () => productApi.getProduct(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};
