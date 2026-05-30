import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { HeadLoadCategory } from "../../../../features/pricing/head-loads/types/head-load-category.types";
import { headLoadCategoryApi } from "./head-load-category.api";

export const headLoadCategoryKeys = {
  all: ["head-load-categories"] as const,
};

export const useGetHeadLoadCategories = (
  options?: Omit<
    UseQueryOptions<
      HeadLoadCategory[],
      Error,
      HeadLoadCategory[],
      readonly string[]
    >,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: headLoadCategoryKeys.all,
    queryFn: headLoadCategoryApi.getHeadLoadCategories,
    staleTime: 1000 * 60 * 30,
    ...options,
  });
};

export const useCreateHeadLoadCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: headLoadCategoryApi.createHeadLoadCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: headLoadCategoryKeys.all });
    },
  });
};

export const useUpdateHeadLoadCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: headLoadCategoryApi.updateHeadLoadCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: headLoadCategoryKeys.all });
    },
  });
};

export const useDeleteHeadLoadCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: headLoadCategoryApi.deleteHeadLoadCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: headLoadCategoryKeys.all });
    },
  });
};
