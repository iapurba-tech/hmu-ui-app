import React, { useState } from "react";
import { Dialog, Box, Typography } from "@mui/material";
import { HmuButton, HmuTextField } from "../../../../../shared/components";
import { type Bank } from "../../types/bank.types";
import * as styles from "./BankDeleteModal.styles";

interface BankDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (bankId: string) => void;
  bank: Bank | null;
  loading?: boolean;
}

const BankDeleteModal: React.FC<BankDeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  bank,
  loading = false,
}) => {
  const [confirmText, setConfirmText] = useState("");
  const [prevOpen, setPrevOpen] = useState(open);


  if (open && !prevOpen) {
    setPrevOpen(true);
    setConfirmText("");
  } else if (!open && prevOpen) {
    setPrevOpen(false);
  }

  const isDeleteConfirmed = confirmText === bank?.code;

  const handleConfirm = () => {
    if (bank && isDeleteConfirmed) {
      onConfirm(bank.id);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} sx={styles.dialogStyles}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
          Delete Bank Account
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mb: 3, lineHeight: 1.6 }}
        >
          Are you sure you want to delete bank account of{" "}
          <strong>{bank?.accountHolderName}</strong> at{" "}
          <strong>{bank?.bankName}</strong>? This action is permanent and cannot be undone.
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={styles.labelStyles}>
            Please type the bank code below to confirm:
          </Typography>
          <Box sx={styles.highlightStyles}>
            <Typography variant="body1" sx={styles.highlightTextStyles}>
              {bank?.code}
            </Typography>
          </Box>
          <HmuTextField
            fullWidth
            placeholder="Type bank code here"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            autoFocus
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <HmuButton
            label="Cancel"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            sx={{ flex: 1 }}
          />
          <HmuButton
            label="Permanently Delete"
            variant="primary"
            onClick={handleConfirm}
            loading={loading}
            disabled={!isDeleteConfirmed}
            sx={styles.deleteButtonStyles}
          />
        </Box>
      </Box>
    </Dialog>
  );
};

export default BankDeleteModal;
