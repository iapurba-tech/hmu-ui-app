import React from "react";
import { Button, type ButtonProps, CircularProgress } from "@mui/material";
import {
  primaryStyles,
  secondaryStyles,
  textStyles,
  darkStyles,
  roundedStyles,
} from "./HmuButton.styles";

export interface HmuButtonProps extends Omit<ButtonProps, "variant"> {
  label: string;
  variant?: "primary" | "secondary" | "text" | "dark";
  loading?: boolean;
  rounded?: boolean;
}

const HmuButton: React.FC<HmuButtonProps> = ({
  label,
  variant = "primary",
  loading = false,
  rounded = false,
  disabled,
  sx,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return primaryStyles;
      case "secondary":
        return secondaryStyles;
      case "text":
        return textStyles;
      case "dark":
        return darkStyles;
      default:
        return primaryStyles;
    }
  };

  const muiVariant =
    variant === "primary" || variant === "dark"
      ? "contained"
      : variant === "text"
        ? "text"
        : "outlined";

  return (
    <Button
      variant={muiVariant}
      disabled={disabled || loading}
      sx={[
        getVariantStyles(),
        ...(rounded ? [roundedStyles] : []),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      {loading ? (
        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
      ) : null}
      {label}
    </Button>
  );
};

export default HmuButton;
