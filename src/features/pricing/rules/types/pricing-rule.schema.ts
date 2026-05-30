import { z } from "zod";

export const pricingRuleSchema = z.object({
  effectiveFrom: z.string().min(1, "Effective date is required"),
  rate: z.number().min(0, "Rate must be 0 or greater"),
});

export type PricingRuleFormData = z.infer<typeof pricingRuleSchema>;
