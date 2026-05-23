import React from "react";
import { Box, Typography, alpha, type SxProps, type Theme } from "@mui/material";
import { palette } from "../../theme";

export interface HmuDataFieldProps {
  label: string;
  value: React.ReactNode;
  sx?: SxProps<Theme>;
}

const HmuDataField: React.FC<HmuDataFieldProps> = ({ label, value, sx }) => {
  const isEmpty = !value || value === "";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, ...sx }}>
      <Typography
        sx={{
          fontSize: "0.75rem",
          fontWeight: 700,
          color: palette.text.secondary,
          textTransform: "uppercase",
          letterSpacing: "0.025em",
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          minHeight: "40px",
          display: "flex",
          alignItems: "center",
          bgcolor: alpha(palette.primary.main, 0.02),
          px: 1.5,
          py: 1,
          borderRadius: "8px",
          border: `1px solid ${alpha(palette.primary.main, 0.06)}`,
        }}
      >
        <Box
          sx={{
            fontSize: "0.875rem",
            color: isEmpty ? palette.text.secondary : palette.text.primary,
            fontWeight: 600,
            fontStyle: isEmpty ? "italic" : "normal",
            opacity: isEmpty ? 0.6 : 1,
            width: "100%",
          }}
        >
          {isEmpty ? "Not provided" : value}
        </Box>
      </Box>
    </Box>
  );
};

export default HmuDataField;
