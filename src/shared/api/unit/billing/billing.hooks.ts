import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { billingApi } from "./billing.api";
import type { BillingRunCreateRequest } from "../../../../features/unit-operations/billing/types/billing.types";

export const billingKeys = {
  all: ["billing"] as const,
  runs: () => [...billingKeys.all, "runs"] as const,
  run: (id: string) => [...billingKeys.all, "run", id] as const,
  invoices: (id: string) => [...billingKeys.run(id), "invoices"] as const,
  invoiceDetail: (id: string) =>
    [...billingKeys.all, "invoice", id, "detail"] as const,
};

export const useGetBillingRuns = () => {
  return useQuery({
    queryKey: billingKeys.runs(),
    queryFn: () => billingApi.getRuns(),
  });
};

export const useGetBillingRun = (id: string) => {
  return useQuery({
    queryKey: billingKeys.run(id),
    queryFn: () => billingApi.getRun(id),
    enabled: !!id,
  });
};

export const useGetBillingInvoices = (id: string | null) => {
  return useQuery({
    queryKey: billingKeys.invoices(id || ""),
    queryFn: () => billingApi.getInvoices(id!),
    enabled: !!id,
  });
};

export const useGetInvoiceDetail = (id: string | null) => {
  return useQuery({
    queryKey: billingKeys.invoiceDetail(id || ""),
    queryFn: () => billingApi.getInvoiceDetail(id!),
    enabled: !!id,
  });
};

export const useCreateBillingRun = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BillingRunCreateRequest) => billingApi.createRun(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.runs() });
    },
  });
};

export const useDeleteBillingRun = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => billingApi.deleteRun(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.runs() });
    },
  });
};
