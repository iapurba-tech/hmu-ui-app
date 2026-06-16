import React, { useState, useMemo } from "react";
import { Box, Typography, IconButton, Stack, Chip } from "@mui/material";
import {
  HmuDataTable,
  HmuTextField,
  HmuSelect,
} from "../../../../shared/components";
import type { Column } from "../../../../shared/components/HmuDataTable/HmuDataTable";
import type { BillingRun } from "../types/billing.types";
import { AddIcon, CheckCircleIcon, CloseIcon } from "../../../../shared/icons";
import { useGetBankAccounts } from "../../../../shared/api/admin/bank/bank.hooks";
import { useAuthStore } from "../../../../shared/store/useAuthStore";
import dayjs from "dayjs";

interface PendingAdviceTableProps {
  runs: BillingRun[];
  isLoading: boolean;
  onGenerate: (data: {
    billingRunId: string;
    payoutBankId: string;
    chequeNumber: string;
  }) => void;
  isGenerating: boolean;
}

const PendingAdviceTable: React.FC<PendingAdviceTableProps> = ({
  runs,
  isLoading,
  onGenerate,
  isGenerating,
}) => {
  const { activeUnit } = useAuthStore();
  const { data: banks = [] } = useGetBankAccounts(activeUnit?.id);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);

  // Local state for the inline form
  const [payoutBankId, setPayoutBankId] = useState<string>("");
  const [chequeNumber, setChequeNumber] = useState<string>("");

  const bankOptions = useMemo(() => {
    return banks.map((b) => ({
      label: `${b.bankName} - ${b.accountNumber}`,
      value: b.id,
    }));
  }, [banks]);

  const handleStartEdit = (id: string) => {
    setEditingRowId(id);
    setPayoutBankId(bankOptions.length > 0 ? bankOptions[0].value : "");
    setChequeNumber("");
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setPayoutBankId("");
    setChequeNumber("");
  };

  const handleSave = (runId: string) => {
    if (!payoutBankId || !chequeNumber.trim()) {
      return; // Basic validation
    }
    onGenerate({
      billingRunId: runId,
      payoutBankId,
      chequeNumber: chequeNumber.trim(),
    });
    setEditingRowId(null);
  };

  const columns: Column<BillingRun>[] = [
    {
      id: "period",
      label: "Billing Period",
      render: (row) => (
        <Typography variant="body2" fontWeight={600}>
          {dayjs(row.periodStartDate).format("DD MMM")} -{" "}
          {dayjs(row.periodEndDate).format("DD MMM, YYYY")}
        </Typography>
      ),
    },
    {
      id: "payoutBankId",
      label: "Payout Bank",
      render: (row) => {
        if (editingRowId === row.id) {
          return (
            <HmuSelect
              name="payoutBankId"
              label=""
              size="small"
              displayEmpty
              value={payoutBankId}
              options={
                bankOptions.length > 0
                  ? bankOptions
                  : [{ label: "Loading or no banks available...", value: "" }]
              }
              onChange={(e) => setPayoutBankId(e.target.value as string)}
              fullWidth
              sx={{ minWidth: 200 }}
            />
          );
        }
        return (
          <Typography variant="body2" color="text.secondary">
            Select bank...
          </Typography>
        );
      },
    },
    {
      id: "chequeNumber",
      label: "Cheque Number",
      render: (row) => {
        if (editingRowId === row.id) {
          return (
            <HmuTextField
              name="chequeNumber"
              label=""
              size="small"
              value={chequeNumber}
              onChange={(e) => setChequeNumber(e.target.value)}
              placeholder="Enter Cheque #"
              fullWidth
            />
          );
        }
        return (
          <Typography variant="body2" color="text.secondary">
            Enter cheque #
          </Typography>
        );
      },
    },
    {
      id: "actions",
      label: "Actions",
      align: "center",
      render: (row) => {
        if (editingRowId === row.id) {
          const isValid = payoutBankId && chequeNumber.trim().length > 0;
          return (
            <Stack direction="row" spacing={1} justifyContent="center">
              <IconButton
                size="small"
                onClick={() => handleSave(row.id)}
                disabled={!isValid || isGenerating}
                sx={{ color: "success.main" }}
                aria-label="save-advice"
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleCancelEdit}
                disabled={isGenerating}
                sx={{ color: "error.main" }}
                aria-label="cancel-edit"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          );
        }

        return (
          <IconButton
            size="small"
            onClick={() => handleStartEdit(row.id)}
            sx={{ color: "primary.main" }}
            aria-label="generate-advice"
            disabled={editingRowId !== null} // disable others while editing one
          >
            <AddIcon fontSize="small" />
          </IconButton>
        );
      },
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Pending Generation
        </Typography>
        <Chip
          label={`${runs.length} Pending`}
          size="small"
          color="warning"
          variant="outlined"
          sx={{ fontWeight: 700 }}
        />
      </Box>
      <HmuDataTable
        columns={columns}
        data={runs}
        keyExtractor={(row) => row.id}
        loading={isLoading}
        emptyMessage="No pending billing runs found"
      />
    </Box>
  );
};

export default PendingAdviceTable;
