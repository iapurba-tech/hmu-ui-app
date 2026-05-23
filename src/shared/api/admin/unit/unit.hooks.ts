import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { Unit } from "../../../features/admin/units/types/unit.types";
import { unitApi } from "./unit.api";

export const unitKeys = {
  all: ["units"] as const,
};

export const useGetUnits = (
  options?: Omit<
    UseQueryOptions<Unit[], Error, Unit[], readonly string[]>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: unitKeys.all,
    queryFn: unitApi.getAllUnits,
    staleTime: 1000 * 60 * 30,
    ...options,
  });
};

export const useCreateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unitApi.createUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitKeys.all });
    },
  });
};

export const useUpdateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unitApi.updateUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitKeys.all });
    },
  });
};

export const useToggleUnitStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      active ? unitApi.deactivateUnit(id) : unitApi.activateUnit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitKeys.all });
    },
  });
};
