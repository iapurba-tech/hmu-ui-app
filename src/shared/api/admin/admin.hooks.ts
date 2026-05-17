import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import type { Unit } from "../../../features/admin/units/types/unit.types";
import { adminApi } from "./admin.api";


// 1. Query Keys (For precise cache invalidation later)
export const adminKeys = {
  all: ['admin'] as const,
  units: () => [...adminKeys.all, 'units'] as const,
};

// 2. The Custom Hooks
export const useGetUnits = (
  options?: Omit<UseQueryOptions<Unit[], Error, Unit[], readonly string[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: adminKeys.units(),
    queryFn: adminApi.getAllUnits,
    staleTime: 1000 * 60 * 30, 
    ...options,
  });
};

export const useCreateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.createUnit,
    onSuccess: () => {
      // Invalidate and refetch units after a successful creation
      queryClient.invalidateQueries({ queryKey: adminKeys.units() });
    },
  });
};

export const useUpdateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.updateUnit,
    onSuccess: () => {
      // Invalidate and refetch units after a successful update
      queryClient.invalidateQueries({ queryKey: adminKeys.units() });
    },
  });
};