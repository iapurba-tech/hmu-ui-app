import { alpha, type SxProps, type Theme } from "@mui/material";
import { palette } from "../../../../../shared/theme";

export const tableWrapperStyles: SxProps<Theme> = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 0,
};

export const usernameStyles: SxProps<Theme> = {
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

export const userNameStyles: SxProps<Theme> = {
  fontWeight: 500,
  fontSize: "0.875rem",
  color: palette.text.primary,
  cursor: "pointer",
  "&:hover": {
    color: palette.primary.main,
    textDecoration: "underline",
  },
};

export const userEmailStyles: SxProps<Theme> = {
  color: palette.text.secondary,
  fontSize: "0.8125rem",
};

export const roleBadgeStyles = (bg: string, color: string): SxProps<Theme> => ({
  fontSize: "0.7rem",
  fontWeight: 800,
  bgcolor: bg,
  color: color,
  px: 1,
  py: 0.25,
  borderRadius: "4px",
  display: "inline-block",
  textTransform: "uppercase",
  letterSpacing: "0.03em",
});

export const statusBadgeStyles = (
  bg: string,
  color: string,
): SxProps<Theme> => ({
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
