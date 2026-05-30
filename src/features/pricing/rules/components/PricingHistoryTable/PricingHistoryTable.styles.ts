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

export const rateContainerStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1,
};

export const rateTextStyles: SxProps<Theme> = {
  fontWeight: 700,
  fontFamily: "'JetBrains Mono', monospace",
};

export const diffBadgeStyles = (diff: number): SxProps<Theme> => {
  const isPositive = diff > 0;
  const color = isPositive ? "success.main" : "error.main";

  return {
    color,
    fontWeight: 800,
    bgcolor: (theme: Theme) =>
      alpha(
        isPositive ? theme.palette.success.main : theme.palette.error.main,
        0.08,
      ),
    px: 0.8,
    py: 0.2,
    borderRadius: "6px",
    fontSize: "0.65rem",
    fontFamily: "'JetBrains Mono', monospace",
    border: "1px solid",
    borderColor: (theme: Theme) =>
      alpha(
        isPositive ? theme.palette.success.main : theme.palette.error.main,
        0.1,
      ),
  };
};
