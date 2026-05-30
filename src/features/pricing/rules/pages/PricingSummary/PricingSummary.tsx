import React from "react";
import { Box, Typography } from "@mui/material";
import PricingRuleCard from "../../components/PricingRuleCard/PricingRuleCard";
import {
  pageContainerStyles,
  headerStyles,
  titleGroupStyles,
  titleStyles,
  subtitleStyles,
  dashboardGridStyles,
} from "./PricingSummary.styles";
import type { PricingRuleType } from "../../types/pricing-rule.types";

const RULE_TYPES: { type: PricingRuleType; title: string }[] = [
  { type: "FAT", title: "FAT rate" },
  { type: "SNF", title: "SNF rate" },
  { type: "COMMISSION", title: "Society Commission" },
  { type: "INCENTIVE", title: "Procurement Incentive" },
  { type: "MGR_SUBSIDY", title: "Managerial Subsidy" },
];

const PricingSummary: React.FC = () => {
  return (
    <Box sx={pageContainerStyles}>
      <Box sx={headerStyles}>
        <Box sx={titleGroupStyles}>
          <Typography variant="h5" sx={titleStyles}>
            Pricing Models
          </Typography>
          <Typography variant="body2" sx={subtitleStyles}>
            Configure and manage global pricing rules.
          </Typography>
        </Box>
      </Box>

      <Box sx={dashboardGridStyles}>
        {RULE_TYPES.map((rule) => (
          <PricingRuleCard
            key={rule.type}
            type={rule.type}
            title={rule.title}
          />
        ))}
      </Box>
    </Box>
  );
};

export default PricingSummary;
