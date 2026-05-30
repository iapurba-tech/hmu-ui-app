import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { headLoadPriceApi } from "./head-load-price.api";
import type { CreateHeadLoadPriceRequest } from "../../../../features/pricing/head-loads/types/head-load-price.types";

export const headLoadPriceKeys = {
  all: ["head-load-prices"] as const,
  byCategory: (categoryId: number) =>
    [...headLoadPriceKeys.all, categoryId] as const,
};

export const useGetHeadLoadPrices = (categoryId?: number) => {
  return useQuery({
    queryKey: categoryId
      ? headLoadPriceKeys.byCategory(categoryId)
      : headLoadPriceKeys.all,
    queryFn: () =>
      categoryId
        ? headLoadPriceApi.getHeadLoadPrices(categoryId)
        : headLoadPriceApi.getAllHeadLoadPrices(),
    enabled: true,
  });
};

export const useCreateHeadLoadPrice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateHeadLoadPriceRequest) =>
      headLoadPriceApi.createHeadLoadPrice(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: headLoadPriceKeys.byCategory(variables.headLoadCategoryId),
      });
    },
  });
};
