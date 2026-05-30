import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type {
  PricingRule,
  PricingRuleType,
} from "../../../../features/pricing/rules/types/pricing-rule.types";
import { pricingRuleApi } from "./pricing-rule.api";

export const pricingRuleKeys = {
  all: ["pricing-rules"] as const,
  byType: (ruleType: PricingRuleType) =>
    [...pricingRuleKeys.all, ruleType] as const,
};

export const useGetPricingRules = (
  ruleType: PricingRuleType,
  options?: Omit<
    UseQueryOptions<PricingRule[], Error, PricingRule[], readonly any[]>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: pricingRuleKeys.byType(ruleType),
    queryFn: () => pricingRuleApi.getPricingRules(ruleType),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};

export const useCreatePricingRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: pricingRuleApi.createPricingRule,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: pricingRuleKeys.byType(variables.ruleType),
      });
    },
  });
};
