import React, { useState, useCallback, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { HmuConfirmModal } from "../../../../../shared/components";
import { palette } from "../../../../../shared/theme";
import {
  pageContainerStyles,
  pageHeaderStyles,
  pageTitleStyles,
} from "../BillingPage/BillingPage.styles";
import {
  useGetBankAdvices,
  useCreateBankAdvice,
  useDeleteBankAdvice,
  useSubmitBankAdvice,
  useProcessBankAdvice,
} from "../../../../../shared/api/unit/billing/bank-advice.hooks";
import { useGetBillingRuns } from "../../../../../shared/api/unit/billing/billing.hooks";
import { useAuthStore } from "../../../../../shared/store/useAuthStore";
import { useNotificationStore } from "../../../../../shared/store/useNotificationStore";
import PendingAdviceTable from "../../components/PendingAdviceTable";
import BankAdviceTable from "../../components/BankAdviceTable";
import dayjs from "dayjs";

const BankAdvicePage: React.FC = () => {
  const { activeUnit } = useAuthStore();
  const { showNotification } = useNotificationStore();

  const { data: runs = [], isLoading: isRunsLoading } = useGetBillingRuns();
  const { data: advices = [], isLoading: isAdvicesLoading } =
    useGetBankAdvices();

  const createMutation = useCreateBankAdvice();
  const deleteMutation = useDeleteBankAdvice();
  const submitMutation = useSubmitBankAdvice();
  const processMutation = useProcessBankAdvice();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filter runs to only those that are PENDING and do not have an advice generated yet
  const pendingRuns = useMemo(() => {
    return runs.filter(
      (run) =>
        run.status === "PENDING" &&
        !advices.some((advice) => advice.billingRunId === run.id),
    );
  }, [runs, advices]);

  const handleGenerateAdvice = useCallback(
    (data: {
      billingRunId: string;
      payoutBankId: string;
      chequeNumber: string;
    }) => {
      if (!activeUnit) return;

      createMutation.mutate(
        {
          unitId: activeUnit.id,
          billingRunId: data.billingRunId,
          payoutBankId: data.payoutBankId,
          chequeNumber: data.chequeNumber,
          adviceDate: dayjs().format("YYYY-MM-DD"), // Always today
          chequeDate: dayjs().format("YYYY-MM-DD"), // Always today
        },
        {
          onSuccess: () => {
            showNotification("Bank advice generated successfully", "success");
          },
          onError: (error: any) => {
            const message =
              error?.response?.data?.message ||
              "Failed to generate bank advice.";
            showNotification(message, "error");
          },
        },
      );
    },
    [activeUnit, createMutation, showNotification],
  );

  const handleDelete = useCallback(() => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => {
          showNotification("Bank advice deleted successfully", "success");
          setDeleteId(null);
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message || "Failed to delete bank advice.";
          showNotification(message, "error");
          setDeleteId(null);
        },
      });
    }
  }, [deleteId, deleteMutation, showNotification]);

  const handleSubmitAdvice = useCallback(
    (id: string) => {
      submitMutation.mutate(id, {
        onSuccess: () => {
          showNotification("Bank advice submitted successfully", "success");
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message || "Failed to submit bank advice.";
          showNotification(message, "error");
        },
      });
    },
    [submitMutation, showNotification],
  );

  const handleProcessAdvice = useCallback(
    (id: string) => {
      processMutation.mutate(id, {
        onSuccess: () => {
          showNotification("Bank advice processed successfully", "success");
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message || "Failed to process bank advice.";
          showNotification(message, "error");
        },
      });
    },
    [processMutation, showNotification],
  );

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={pageHeaderStyles}>
        <Box>
          <Typography variant="h5" sx={pageTitleStyles}>
            Bank Advice
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: palette.text.secondary, mt: 0.5 }}
          >
            Generate and manage bank advice for completed billing runs.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <PendingAdviceTable
          runs={pendingRuns}
          isLoading={isRunsLoading || isAdvicesLoading}
          onGenerate={handleGenerateAdvice}
          isGenerating={createMutation.isPending}
        />

        <Box sx={{ borderTop: `1px solid ${palette.divider}`, pt: 4 }}>
          <BankAdviceTable
            advices={advices}
            isLoading={isAdvicesLoading}
            onDelete={setDeleteId}
            onSubmitAdvice={handleSubmitAdvice}
            onProcessAdvice={handleProcessAdvice}
          />
        </Box>
      </Box>

      <HmuConfirmModal
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Bank Advice"
        message="Are you sure you want to delete this bank advice? This action cannot be undone."
        loading={deleteMutation.isPending}
      />
    </Box>
  );
};

export default BankAdvicePage;
