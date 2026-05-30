export type PricingRuleType = "FAT" | "SNF" | "COMMISSION" | "INCENTIVE" | "MGR_SUBSIDY";
export type PricingRuleStatus = "ACTIVE" | "INACTIVE" | "EXPIRED";

export interface PricingRule {
  id: string;
  effectiveFrom: string;
  ruleType: PricingRuleType;
  rate: number;
  status: PricingRuleStatus;
  effectiveTo?: string;
}

export interface CreatePricingRuleRequest {
  effectiveFrom: string;
  ruleType: PricingRuleType;
  rate: number;
}
