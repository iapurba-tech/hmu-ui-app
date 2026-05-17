import React from "react";
import { Snackbar, Alert } from "@mui/material";
import { useNotificationStore } from "../../store/useNotificationStore";
import { snackbarStyles, alertStyles } from "./HmuNotification.styles";

const HmuNotification: React.FC = () => {
  const { isOpen, message, type, hideNotification } = useNotificationStore();

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    hideNotification();
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={snackbarStyles}
    >
      <Alert
        onClose={handleClose}
        severity={type}
        variant="filled"
        sx={alertStyles(type)}
        elevation={0}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default HmuNotification;
