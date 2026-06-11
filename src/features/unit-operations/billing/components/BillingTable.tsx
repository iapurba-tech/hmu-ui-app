import React from "react";
import { Box, Typography, Chip, IconButton, Tooltip } from "@mui/material";
import { HmuDataTable } from "../../../../shared/components";
import type { Column } from "../../../../shared/components/HmuDataTable/HmuDataTable";
import type { BillingRun } from "../types/billing.types";
import { DeleteIcon, InvoiceIcon } from "../../../../shared/icons";
import dayjs from "dayjs";

interface BillingTableProps {
  runs: BillingRun[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const BillingTable: React.FC<BillingTableProps> = ({
  runs,
  isLoading,
  onDelete,
  onView,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "PENDING":
        return "warning";
      case "FAILED":
        return "error";
      case "PROCESSED":
        return "info";
      default:
        return "default";
    }
  };

  const columns: Column<BillingRun>[] = [
    {
      id: "period",
      label: "Period",
      render: (row) => (
        <Typography variant="body2">
          {dayjs(row.periodStartDate).format("MMM DD, YYYY")} -{" "}
          {dayjs(row.periodEndDate).format("MMM DD, YYYY")}
        </Typography>
      ),
    },
    {
      id: "status",
      label: "Status",
      render: (row) => (
        <Chip
          label={row.status}
          size="small"
          color={getStatusColor(row.status) as any}
          variant="outlined"
        />
      ),
    },
    {
      id: "processedAt",
      label: "Processed At",
      render: (row) => (
        <Typography variant="body2">
          {row.processedAt ? dayjs(row.processedAt).format("MMM DD, YYYY HH:mm") : "-"}
        </Typography>
      ),
    },
    {
      id: "actions",
      label: "Actions",
      align: "center",
      render: (row) => (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          <Tooltip title="View Invoices">
            <IconButton
              size="small"
              onClick={() => onView(row.id)}
              sx={{ color: "primary.main" }}
              aria-label="view-invoices"
            >
              <InvoiceIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Run">
            <IconButton
              size="small"
              onClick={() => onDelete(row.id)}
              sx={{ color: "error.main" }}
              aria-label="delete-run"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        Previous Runs
      </Typography>
      <HmuDataTable
        columns={columns}
        data={runs}
        keyExtractor={(row) => row.id}
        loading={isLoading}
        emptyMessage="No billing runs found"
      />
    </Box>
  );
};

export default BillingTable;
