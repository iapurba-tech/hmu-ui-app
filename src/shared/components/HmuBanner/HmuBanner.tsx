import React from "react";
import { Alert, Box } from "@mui/material";
import { alertStyles } from "../HmuNotification/HmuNotification.styles";

export interface HmuBannerProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  onClose?: () => void;
  sx?: any;
}

const HmuBanner: React.FC<HmuBannerProps> = ({
  message,
  type,
  onClose,
  sx,
}) => {
  if (!message) return null;

  return (
    <Box sx={{ mb: 2, ...sx }}>
      <Alert
        onClose={onClose}
        severity={type}
        variant="filled"
        sx={alertStyles(type)}
        elevation={0}
      >
        {message}
      </Alert>
    </Box>
  );
};

export default HmuBanner;
