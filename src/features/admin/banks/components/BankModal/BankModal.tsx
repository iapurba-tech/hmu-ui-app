import React, { useCallback } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import {
  dialogStyles,
  dialogTitleStyles,
  dialogContentStyles,
} from "./BankModal.styles";
import BankForm from "../BankForm/BankForm";
import type { Bank } from "../../types/bank.types";
import { 
  useCreateBankAccount, 
  useUpdateBankAccount 
} from "../../../../../shared/api/admin/admin.hooks";
import { useNotificationStore } from "../../../../../shared/store/useNotificationStore";
import type { BankFormData } from "../../types/bank.schema";

interface BankModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "view";
  bank: Bank | null;
}

const BankModal: React.FC<BankModalProps> = ({
  open,
  onClose,
  mode,
  bank,
}) => {
  const { showNotification } = useNotificationStore();
  const { mutate: createBank, isPending: isCreating } = useCreateBankAccount();
  const { mutate: updateBank, isPending: isUpdating } = useUpdateBankAccount();

  const isViewMode = mode === "view";
  const isLoading = isCreating || isUpdating;

  const getTitle = () => {
    if (isViewMode) return "Bank Account Details";
    return mode === "create" ? "Add New Bank Account" : "Edit Bank Account";
  };

  const handleSubmit = useCallback((data: BankFormData) => {
    if (mode === "create") {
      createBank(data, {
        onSuccess: () => {
          showNotification("Bank account created successfully", "success");
          onClose();
        },
        onError: (error: any) => {
          showNotification(
            error?.response?.data?.message || "Failed to create bank account",
            "error"
          );
        },
      });
    } else if (mode === "edit" && bank) {
      updateBank(
        { id: bank.id, ...data },
        {
          onSuccess: () => {
            showNotification("Bank account updated successfully", "success");
            onClose();
          },
          onError: (error: any) => {
            showNotification(
              error?.response?.data?.message || "Failed to update bank account",
              "error"
            );
          },
        }
      );
    }
  }, [mode, bank, createBank, updateBank, onClose, showNotification]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      sx={dialogStyles}
      scroll="body"
    >
      <DialogTitle sx={dialogTitleStyles}>
        {getTitle()}
      </DialogTitle>
      <DialogContent sx={dialogContentStyles}>
        <BankForm
          mode={mode}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={isLoading}
          defaultValues={bank ? {
            ...bank,
            unitId: bank.unit.id
          } : undefined}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BankModal;
