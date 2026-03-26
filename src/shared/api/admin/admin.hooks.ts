import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { Unit } from "../../../features/admin/types/unit.types";
import { adminApi } from "./admin.api";


// 1. Query Keys (For precise cache invalidation later)
export const adminKeys = {
  all: ['admin'] as const,
  units: () => [...adminKeys.all, 'units'] as const,
};

// 2. The Custom Hook
// We allow passing standard React Query options (like `enabled`) 
// so the UI has full control over *when* this fires.
export const useGetUnits = (
  options?: Omit<UseQueryOptions<Unit[], Error, Unit[], readonly string[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: adminKeys.units(),
    queryFn: adminApi.getAllUnits,
    // Units rarely change during a single session, so we cache them for 30 minutes
    staleTime: 1000 * 60 * 30, 
    ...options, // Spread any custom options (like enabled: isSystemAdmin)
  });
};