import type {
  PricingRule,
  CreatePricingRuleRequest,
  PricingRuleType,
} from "../../../../features/pricing/rules/types/pricing-rule.types";
import { apiClient } from "../../apiClient";
import { API_ENDPOINTS } from "../../endpoints";

export const pricingRuleApi = {
  getPricingRules: async (
    ruleType: PricingRuleType,
  ): Promise<PricingRule[]> => {
    const response = await apiClient.get<PricingRule[]>(
      API_ENDPOINTS.PRICING.RULE.LIST(ruleType),
    );
    return response.data;
  },

  createPricingRule: async (
    data: CreatePricingRuleRequest,
  ): Promise<PricingRule> => {
    const response = await apiClient.post<PricingRule>(
      API_ENDPOINTS.PRICING.RULE.CREATE,
      data,
    );
    return response.data;
  },
};
