import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bankAdviceApi } from "./bank-advice.api";
import type { BankAdviceCreateRequest } from "../../../../features/unit-operations/billing/types/bank-advice.types";

export const bankAdviceKeys = {
  all: ["bank-advice"] as const,
  advices: () => [...bankAdviceKeys.all, "list"] as const,
  advice: (id: string) => [...bankAdviceKeys.all, "detail", id] as const,
};

export const useGetBankAdvices = () => {
  return useQuery({
    queryKey: bankAdviceKeys.advices(),
    queryFn: () => bankAdviceApi.getAdvices(),
  });
};

export const useGetBankAdvice = (id: string) => {
  return useQuery({
    queryKey: bankAdviceKeys.advice(id),
    queryFn: () => bankAdviceApi.getAdvice(id),
    enabled: !!id,
  });
};

export const useCreateBankAdvice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BankAdviceCreateRequest) =>
      bankAdviceApi.createAdvice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankAdviceKeys.advices() });
    },
  });
};

export const useSubmitBankAdvice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bankAdviceApi.submitAdvice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankAdviceKeys.advices() });
    },
  });
};

export const useProcessBankAdvice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bankAdviceApi.processAdvice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankAdviceKeys.advices() });
    },
  });
};

export const useDeleteBankAdvice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bankAdviceApi.deleteAdvice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankAdviceKeys.advices() });
    },
  });
};
