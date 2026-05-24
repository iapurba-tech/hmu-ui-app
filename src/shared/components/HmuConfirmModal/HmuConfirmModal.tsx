import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { HmuButton } from "../index";
import { CloseIcon } from "../../icons";
import IconButton from "@mui/material/IconButton";

interface HmuConfirmModalProps {
  open: boolean;
  title: string;
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "primary" | "danger";
  loading?: boolean;
}

const HmuConfirmModal: React.FC<HmuConfirmModalProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "primary",
  loading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "16px",
            width: "100%",
            maxWidth: "400px",
            p: 1,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 800,
          fontSize: "1.125rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        {title}
        <IconButton onClick={onCancel} size="small" disabled={loading}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pb: 3 }}>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ lineHeight: 1.6 }}
        >
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <HmuButton
          label={cancelLabel}
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
          sx={{ flex: 1 }}
        />
        <HmuButton
          label={confirmLabel}
          variant={confirmVariant === "danger" ? "primary" : "primary"}
          onClick={onConfirm}
          loading={loading}
          sx={{
            flex: 1,
            ...(confirmVariant === "danger" && {
              bgcolor: "#ef4444",
              "&:hover": { bgcolor: "#dc2626" },
            }),
          }}
        />
      </DialogActions>
    </Dialog>
  );
};

export default HmuConfirmModal;
