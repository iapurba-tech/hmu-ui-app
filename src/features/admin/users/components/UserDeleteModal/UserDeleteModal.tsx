import React, { useState } from "react";
import { Dialog, Box, Typography } from "@mui/material";
import { HmuButton, HmuTextField } from "../../../../../shared/components";
import { type User } from "../../types/user.types";
import * as styles from "./UserDeleteModal.styles";

interface UserDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (userId: string) => void;
  user: User | null;
  loading?: boolean;
}

const UserDeleteModal: React.FC<UserDeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  user,
  loading = false,
}) => {
  const [confirmText, setConfirmText] = useState("");
  const [prevOpen, setPrevOpen] = useState(open);

  // Reset confirm text when modal opens
  if (open && !prevOpen) {
    setPrevOpen(true);
    setConfirmText("");
  } else if (!open && prevOpen) {
    setPrevOpen(false);
  }

  const isDeleteConfirmed = confirmText === user?.username;

  const handleConfirm = () => {
    if (user && isDeleteConfirmed) {
      onConfirm(user.id);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} sx={styles.dialogStyles}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
          Delete User Permanently
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mb: 3, lineHeight: 1.6 }}
        >
          Are you sure you want to delete user{" "}
          <strong>
            {user?.firstname} {user?.lastname}
          </strong>{" "}
          ({user?.username})? This action cannot be undone.
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={styles.labelStyles}>
            Please type the username below to confirm:
          </Typography>
          <Box sx={styles.usernameHighlightStyles}>
            <Typography variant="body1" sx={styles.usernameTextStyles}>
              {user?.username}
            </Typography>
          </Box>
          <HmuTextField
            fullWidth
            placeholder="Type username here"
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

export default UserDeleteModal;
