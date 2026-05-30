import React from "react";
import { Box, Typography } from "@mui/material";
import { HmuDataTable, type Column } from "../../../../../shared/components";
import type { PricingRule } from "../../types/pricing-rule.types";
import { formatDate } from "../../../../../shared/utils";
import {
  historyCardStyles,
  historyHeaderStyles,
  sectionTitleStyles,
  rateContainerStyles,
  rateTextStyles,
  diffBadgeStyles,
} from "./PricingHistoryTable.styles";

interface PricingHistoryTableProps {
  rules: PricingRule[];
  isLoading?: boolean;
}

const PricingHistoryTable: React.FC<PricingHistoryTableProps> = ({
  rules,
  isLoading = false,
}) => {
  const columns: Column<PricingRule>[] = [
    {
      id: "rate",
      label: "Applied Rate",
      width: "33%",
      render: (row) => {
        const index = rules.findIndex((r) => r.id === row.id);
        const prevRule = index < rules.length - 1 ? rules[index + 1] : null;
        const diff = prevRule ? row.rate - prevRule.rate : 0;

        return (
          <Box sx={rateContainerStyles}>
            <Typography sx={rateTextStyles}>₹{row.rate.toFixed(2)}</Typography>
            {diff !== 0 && (
              <Typography variant="caption" sx={diffBadgeStyles(diff)}>
                {diff > 0 ? "+" : ""}
                {diff.toFixed(2)}
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      id: "effectiveFrom",
      label: "Start Date",
      width: "33%",
      render: (row) => formatDate(row.effectiveFrom),
    },
    {
      id: "effectiveTo",
      label: "End Date",
      width: "33%",
      render: (row) => formatDate(row.effectiveTo),
    },
  ];

  return (
    <Box sx={historyCardStyles}>
      <Box sx={historyHeaderStyles}>
        <Typography sx={sectionTitleStyles}>Pricing History</Typography>
      </Box>
      <HmuDataTable
        columns={columns}
        data={rules}
        loading={isLoading}
        keyExtractor={(row) => row.id}
        emptyMessage="No previous pricing history found for this category."
        omitTopRadius={true}
      />
    </Box>
  );
};

export default PricingHistoryTable;
