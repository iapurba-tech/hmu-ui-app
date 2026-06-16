import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Chip,
  Tooltip,
  IconButton,
  Stack,
} from "@mui/material";
import { HmuDataTable } from "../../../../shared/components";
import type { Column } from "../../../../shared/components/HmuDataTable/HmuDataTable";
import type { BankAdvice } from "../types/bank-advice.types";
import {
  DeleteIcon,
  PlayArrowIcon,
  CheckCircleIcon,
} from "../../../../shared/icons";
import { useGetBankAccounts } from "../../../../shared/api/admin/bank/bank.hooks";
import { useAuthStore } from "../../../../shared/store/useAuthStore";
import dayjs from "dayjs";

interface BankAdviceTableProps {
  advices: BankAdvice[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onSubmitAdvice: (id: string) => void;
  onProcessAdvice: (id: string) => void;
}

const BankAdviceTable: React.FC<BankAdviceTableProps> = ({
  advices,
  isLoading,
  onDelete,
  onSubmitAdvice,
  onProcessAdvice,
}) => {
  const { activeUnit } = useAuthStore();
  const { data: banks = [] } = useGetBankAccounts(activeUnit?.id);

  const bankMap = useMemo(() => {
    const map: Record<string, string> = {};
    banks.forEach((b) => {
      map[b.id] = `${b.bankName} - ${b.accountNumber}`;
    });
    return map;
  }, [banks]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "SUBMITTED":
        return "info";
      case "DRAFT":
        return "warning";
      default:
        return "default";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const columns: Column<BankAdvice>[] = [
    {
      id: "adviceNumber",
      label: "Advice #",
      width: "140px",
      render: (row) => (
        <Typography
          variant="body2"
          fontWeight={700}
          sx={{ fontFamily: "monospace" }}
        >
          {row.adviceNumber}
        </Typography>
      ),
    },
    {
      id: "adviceDate",
      label: "Advice Date",
      render: (row) => (
        <Typography variant="body2">
          {dayjs(row.adviceDate).format("DD MMM YYYY")}
        </Typography>
      ),
    },
    {
      id: "payoutBankId",
      label: "Payout Bank",
      render: (row) => (
        <Tooltip title={bankMap[row.payoutBankId] || "Unknown Bank"}>
          <Typography variant="body2" noWrap sx={{ maxWidth: "150px" }}>
            {bankMap[row.payoutBankId] || row.payoutBankId.substring(0, 8)}
          </Typography>
        </Tooltip>
      ),
    },
    {
      id: "chequeDetails",
      label: "Cheque Details",
      render: (row) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {row.chequeNumber}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {dayjs(row.chequeDate).format("DD MMM YYYY")}
          </Typography>
        </Box>
      ),
    },
    {
      id: "totalAmount",
      label: "Total Amount",
      align: "right",
      render: (row) => (
        <Typography variant="body2" fontWeight={700} color="primary.main">
          {formatCurrency(row.totalAmount || 0)}
        </Typography>
      ),
    },
    {
      id: "status",
      label: "Status",
      align: "center",
      render: (row) => (
        <Chip
          label={row.status}
          size="small"
          color={getStatusColor(row.status) as any}
          variant="outlined"
          sx={{ fontWeight: 700 }}
        />
      ),
    },
    {
      id: "actions",
      label: "Actions",
      align: "center",
      render: (row) => (
        <Stack direction="row" spacing={1} justifyContent="center">
          {row.status === "DRAFT" && (
            <Tooltip title="Submit Advice">
              <IconButton
                size="small"
                onClick={() => onSubmitAdvice(row.id)}
                sx={{ color: "info.main" }}
                aria-label="submit-advice"
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {row.status === "SUBMITTED" && (
            <Tooltip title="Process Advice">
              <IconButton
                size="small"
                onClick={() => onProcessAdvice(row.id)}
                sx={{ color: "success.main" }}
                aria-label="process-advice"
              >
                <PlayArrowIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {row.status === "DRAFT" && (
            <Tooltip title="Delete Advice">
              <IconButton
                size="small"
                onClick={() => onDelete(row.id)}
                sx={{ color: "error.main" }}
                aria-label="delete-advice"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        Bank Advices
      </Typography>
      <HmuDataTable
        columns={columns}
        data={advices}
        keyExtractor={(row) => row.id}
        loading={isLoading}
        emptyMessage="No bank advices found"
      />
    </Box>
  );
};

export default BankAdviceTable;
