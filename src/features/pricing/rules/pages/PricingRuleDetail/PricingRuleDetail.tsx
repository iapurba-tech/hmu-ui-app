import React from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import { useGetPricingRules } from "../../../../../shared/api/pricing/rule/pricing-rule.hooks";
import { HmuLoader, HmuBreadcrumb } from "../../../../../shared/components";
import type { PricingRuleType } from "../../types/pricing-rule.types";
import { PricingHistoryTable, PricingRuleCard } from "../../components";
import {
  pageContainerStyles,
  headerStyles,
  titleGroupStyles,
  contentGridStyles,
} from "./PricingRuleDetail.styles";

const RULE_TITLES: Record<string, string> = {
  FAT: "FAT rate",
  SNF: "SNF rate",
  COMMISSION: "Society Commission",
  INCENTIVE: "Procurement Incentive",
  MGR_SUBSIDY: "Managerial Subsidy",
};

const PricingRuleDetailsPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();

  const ruleType = type?.toUpperCase() as PricingRuleType;
  const title = RULE_TITLES[ruleType] || "Pricing Rule Details";

  const { data: rules = [], isLoading } = useGetPricingRules(ruleType);

  if (isLoading) return <HmuLoader />;

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={headerStyles}>
        <Box sx={titleGroupStyles}>
          <HmuBreadcrumb
            items={[
              { label: "Pricing Models", path: "/admin/pricing" },
              { label: title },
            ]}
          />
        </Box>
      </Box>

      <Box sx={contentGridStyles}>
        {/* Pricing Card Section */}
        <PricingRuleCard
          type={ruleType}
          title={title}
          showViewHistory={false}
          disableNavigation={true}
        />

        {/* History Section */}
        <PricingHistoryTable rules={rules} />
      </Box>
    </Box>
  );
};

export default PricingRuleDetailsPage;
