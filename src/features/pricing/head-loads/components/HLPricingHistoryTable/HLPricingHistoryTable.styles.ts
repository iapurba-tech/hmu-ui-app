import { alpha, type SxProps, type Theme } from "@mui/material";

export const historyCardStyles: SxProps<Theme> = {
  bgcolor: "background.paper",
  borderRadius: "16px",
  border: "1px solid",
  borderColor: "divider",
  overflow: "hidden",
};

export const historyHeaderStyles: SxProps<Theme> = {
  p: 3,
  borderBottom: "1px solid",
  borderColor: "divider",
};

export const sectionTitleStyles: SxProps<Theme> = {
  fontWeight: 700,
  fontSize: "0.875rem",
  color: "text.primary",
  mb: 0,
};

export const statusBadgeStyles = (status: string): SxProps<Theme> => {
  const isActive = status === "ACTIVE";
  const color = isActive ? "#10b981" : "#ef4444";

  return {
    display: "inline-flex",
    px: 1,
    py: 0.5,
    borderRadius: "6px",
    fontSize: "0.75rem",
    fontWeight: 700,
    bgcolor: alpha(color, 0.1),
    color: color,
  };
};

export const monoTextStyles: SxProps<Theme> = {
  fontWeight: 700,
  fontFamily: "'JetBrains Mono', monospace",
};

export const rateTextStyles: SxProps<Theme> = {
  ...monoTextStyles,
  color: "primary.main",
};
