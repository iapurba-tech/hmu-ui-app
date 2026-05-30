import { alpha } from "@mui/material";
import { palette } from "../../../../../shared/theme";

export const tableWrapperStyles = {
  mt: 0,
};

export const codeStyles = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "0.75rem",
  fontWeight: 700,
  color: palette.primary.main,
  bgcolor: alpha(palette.primary.main, 0.08),
  px: 1,
  py: 0.3,
  borderRadius: "4px",
  display: "inline-block",
};

export const descriptionStyles = {
  fontSize: "0.875rem",
  fontWeight: 600,
  color: "text.primary",
};

export const activeBadgeStyles = (active: boolean) => {
  const color = active ? palette.success.main : palette.error.main;
  const bgColor = active
    ? alpha(palette.success.main, 0.1)
    : alpha(palette.error.main, 0.1);

  return {
    fontSize: "0.7rem",
    fontWeight: 700,
    px: 1.2,
    py: 0.4,
    borderRadius: "6px",
    display: "inline-block",
    color,
    bgcolor: bgColor,
    textTransform: "uppercase",
    letterSpacing: "0.02em",
  };
};

export const actionButtonStyles = {
  color: "text.secondary",
  transition: "all 0.2s ease",
  "&:hover": {
    color: palette.primary.main,
    bgcolor: alpha(palette.primary.main, 0.08),
    transform: "translateY(-1px)",
  },
};

export const deleteButtonStyles = {
  color: "text.secondary",
  transition: "all 0.2s ease",
  "&:hover": {
    color: palette.error.main,
    bgcolor: alpha(palette.error.main, 0.08),
    transform: "translateY(-1px)",
  },
};
