import React from "react";
import { Box, Typography } from "@mui/material";
import { HmuDataTable, type Column } from "../../../../../shared/components";
import type { HeadLoadPrice } from "../../types/head-load-price.types";
import { formatDate } from "../../../../../shared/utils";
import {
  historyCardStyles,
  historyHeaderStyles,
  sectionTitleStyles,
  statusBadgeStyles,
  monoTextStyles,
  rateTextStyles,
} from "./HLPricingHistoryTable.styles";

interface HLPricingHisotryTableProps {
  prices: HeadLoadPrice[];
  isLoading?: boolean;
}

const HLPricingHisotryTable: React.FC<HLPricingHisotryTableProps> = ({
  prices,
  isLoading = false,
}) => {
  const columns: Column<HeadLoadPrice>[] = [
    {
      id: "quantityFrom",
      label: "Qty Range (Kg)",
      width: "25%",
      render: (row) => (
        <Typography sx={monoTextStyles}>
          {row.quantityFrom.toFixed(3)}
        </Typography>
      ),
    },
    {
      id: "rate",
      label: "Rate (₹)",
      width: "25%",
      render: (row) => (
        <Typography sx={rateTextStyles}>₹{row.rate.toFixed(2)}</Typography>
      ),
    },
    {
      id: "effectiveFrom",
      label: "Start Date",
      width: "25%",
      render: (row) => formatDate(row.effectiveFrom),
    },
    {
      id: "status",
      label: "Status",
      width: "25%",
      render: (row) => (
        <Box sx={statusBadgeStyles(row.status)}>{row.status}</Box>
      ),
    },
  ];

  return (
    <Box sx={historyCardStyles}>
      <Box sx={historyHeaderStyles}>
        <Typography sx={sectionTitleStyles}>Pricing History</Typography>
      </Box>
      <HmuDataTable
        columns={columns}
        data={prices}
        loading={isLoading}
        keyExtractor={(row) => row.id}
        emptyMessage="No price ranges found for this category."
        omitTopRadius={true}
      />
    </Box>
  );
};

export default HLPricingHisotryTable;
