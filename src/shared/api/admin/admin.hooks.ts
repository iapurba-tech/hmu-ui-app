import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { Unit } from "../../../features/admin/units/types/unit.types";
import type { User } from "../../../features/admin/users/types/user.types";
import type { Bank } from "../../../features/admin/banks/types/bank.types";
import { adminApi } from "./admin.api";

// 1. Query Keys (For precise cache invalidation later)
export const adminKeys = {
  all: ["admin"] as const,
  units: () => [...adminKeys.all, "units"] as const,
  users: () => [...adminKeys.all, "users"] as const,
  bankAccounts: () => [...adminKeys.all, "bankAccounts"] as const,
};

// 2. The Custom Hooks

// Unit Hooks
export const useGetUnits = (
  options?: Omit<
    UseQueryOptions<Unit[], Error, Unit[], readonly string[]>,
    "queryKey" | "queryFn"
  >,
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

export const useToggleUnitStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      active ? adminApi.deactivateUnit(id) : adminApi.activateUnit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.units() });
    },
  });
};

// User Hooks
export const useGetUsers = (
  options?: Omit<
    UseQueryOptions<User[], Error, User[], readonly string[]>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: adminKeys.users(),
    queryFn: adminApi.getAllUsers,
    staleTime: 1000 * 60 * 30,
    ...options,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      active ? adminApi.deactivateUser(id) : adminApi.activateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
};

export const useDeleteUserPermanent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.deleteUserPermanent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
};

// Bank Account Hooks
export const useGetBankAccounts = (
  options?: Omit<
    UseQueryOptions<Bank[], Error, Bank[], readonly string[]>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: adminKeys.bankAccounts(),
    queryFn: adminApi.getAllBankAccounts,
    staleTime: 1000 * 60 * 30,
    ...options,
  });
};

export const useGetBankAccount = (id: string) => {
  return useQuery({
    queryKey: [...adminKeys.bankAccounts(), id],
    queryFn: () => adminApi.getBankAccount(id),
    enabled: !!id,
  });
};

export const useCreateBankAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.createBankAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.bankAccounts() });
    },
  });
};

export const useUpdateBankAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.updateBankAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.bankAccounts() });
    },
  });
};

export const useDeleteBankAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.deleteBankAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.bankAccounts() });
    },
  });
};
