import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { Bank } from "../../../../features/admin/banks/types/bank.types";
import { bankApi } from "./bank.api";

export const bankKeys = {
  all: ["bankAccounts"] as const,
};

export const useGetBankAccounts = (
  options?: Omit<
    UseQueryOptions<Bank[], Error, Bank[], readonly string[]>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: bankKeys.all,
    queryFn: bankApi.getAllBankAccounts,
    staleTime: 1000 * 60 * 30,
    ...options,
  });
};

export const useGetBankAccount = (id: string) => {
  return useQuery({
    queryKey: [...bankKeys.all, id],
    queryFn: () => bankApi.getBankAccount(id),
    enabled: !!id,
  });
};

export const useCreateBankAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bankApi.createBankAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankKeys.all });
    },
  });
};

export const useUpdateBankAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bankApi.updateBankAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankKeys.all });
    },
  });
};

export const useDeleteBankAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bankApi.deleteBankAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankKeys.all });
    },
  });
};
