import React from "react";
import { Button, type ButtonProps, CircularProgress } from "@mui/material";
import { primaryStyles, secondaryStyles } from "./HmuButton.styles";

export interface HmuButtonProps extends Omit<ButtonProps, "variant"> {
  label: string;
  variant?: "primary" | "secondary";
  loading?: boolean;
}

const HmuButton: React.FC<HmuButtonProps> = ({
  label,
  variant = "primary",
  loading = false,
  disabled,
  sx,
  ...props
}) => {
  const variantStyles = variant === "primary" ? primaryStyles : secondaryStyles;

  return (
    <Button
      variant={variant === "primary" ? "contained" : "outlined"}
      disabled={disabled || loading}
      sx={[variantStyles, ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : label}
    </Button>
  );
};

export default HmuButton;
