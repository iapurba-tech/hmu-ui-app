import { alpha, type SxProps, type Theme } from "@mui/material";
import { palette } from "../../../../../shared/theme";

export const tableWrapperStyles: SxProps<Theme> = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 0,
};

export const unitCodeStyles: SxProps<Theme> = {
  fontWeight: 700,
  color: palette.primary.main,
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "0.75rem",
  bgcolor: alpha(palette.primary.main, 0.05),
  px: 1,
  py: 0.5,
  borderRadius: "4px",
  display: "inline-block",
};

export const unitNameStyles: SxProps<Theme> = {
  fontWeight: 600,
  color: palette.text.primary,
  cursor: "pointer",
  "&:hover": {
    color: palette.primary.main,
    textDecoration: "underline",
  },
};

export const unitAddressStyles: SxProps<Theme> = {
  color: palette.text.secondary,
  fontSize: "0.8125rem",
  maxWidth: "250px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export const statusBadgeStyles = (bg: string, color: string): SxProps<Theme> => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 1,
  px: 1.5,
  py: 0.5,
  borderRadius: "20px",
  fontSize: "0.75rem",
  fontWeight: 700,
  bgcolor: bg,
  color: color,
  textTransform: "uppercase",
  letterSpacing: "0.02em",
});

export const statusDotStyles = (dotColor: string): SxProps<Theme> => ({
  width: 6,
  height: 6,
  borderRadius: "50%",
  bgcolor: dotColor,
});

export const actionButtonStyles: SxProps<Theme> = {
  color: palette.text.secondary,
  "&:hover": {
    color: palette.primary.main,
    bgcolor: alpha(palette.primary.main, 0.08),
  },
};
