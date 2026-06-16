import React, { useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { HmuConfirmModal } from "../../../../../shared/components";
import { palette } from "../../../../../shared/theme";
import {
  pageContainerStyles,
  pageHeaderStyles,
  pageTitleStyles,
  contentGridStyles,
} from "./BillingPage.styles";
import {
  useGetBillingRuns,
  useCreateBillingRun,
  useDeleteBillingRun,
} from "../../../../../shared/api/unit/billing/billing.hooks";
import { useAuthStore } from "../../../../../shared/store/useAuthStore";
import { useNotificationStore } from "../../../../../shared/store/useNotificationStore";
import BillingForm from "../../components/BillingForm";
import BillingTable from "../../components/BillingTable";
import type { BillingRunCreateRequest } from "../../types/billing.types";

const BillingPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeUnit } = useAuthStore();
  const { showNotification } = useNotificationStore();
  const { data: runs = [], isLoading } = useGetBillingRuns();
  const createMutation = useCreateBillingRun();
  const deleteMutation = useDeleteBillingRun();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSubmit = useCallback(
    (data: Omit<BillingRunCreateRequest, "unitId">) => {
      if (!activeUnit) return;

      createMutation.mutate(
        {
          ...data,
          unitId: activeUnit.id,
        },
        {
          onSuccess: (newRun) => {
            showNotification("Billing run started successfully", "success");
            navigate(`/unit/billing/runs/${newRun.id}`);
          },
          onError: (error: any) => {
            const message = error?.response?.data?.message || "Failed to start billing run.";
            showNotification(message, "error");
          }
        },
      );
    },
    [activeUnit, createMutation, navigate, showNotification],
  );

  const handleDelete = useCallback(() => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => {
          showNotification("Billing run deleted successfully", "success");
          setDeleteId(null);
        },
        onError: (error: any) => {
          const message = error?.response?.data?.message || "Failed to delete billing run. It may already be completed.";
          showNotification(message, "error");
          setDeleteId(null);
        }
      });
    }
  }, [deleteId, deleteMutation, showNotification]);

  const handleView = (id: string) => {
    navigate(`/unit/billing/runs/${id}`);
  };

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={pageHeaderStyles}>
        <Box>
          <Typography variant="h5" sx={pageTitleStyles}>
            Billing Runs
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: palette.text.secondary, mt: 0.5 }}
          >
            Generate and manage billing runs for your unit.
          </Typography>
        </Box>
      </Box>

      <Box sx={contentGridStyles}>
        <BillingForm
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
        />
        <BillingTable
          runs={runs}
          isLoading={isLoading}
          onDelete={setDeleteId}
          onView={handleView}
        />
      </Box>

      <HmuConfirmModal
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Billing Run"
        message="Are you sure you want to delete this billing run? This action cannot be undone."
        loading={deleteMutation.isPending}
      />
    </Box>
  );
};

export default BillingPage;
