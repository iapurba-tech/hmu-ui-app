import { alpha, type SxProps, type Theme } from "@mui/material";
import { palette } from "../../../../../shared/theme";

export const tableWrapperStyles: SxProps<Theme> = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 0,
};

export const codeStyles: SxProps<Theme> = {
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

export const nameStyles: SxProps<Theme> = {
  fontWeight: 600,
  color: palette.text.primary,
  fontSize: "0.875rem",
  cursor: "pointer",
  "&:hover": {
    color: palette.primary.main,
    textDecoration: "underline",
  },
};

export const accountNumberStyles: SxProps<Theme> = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "0.8125rem",
  color: palette.text.secondary,
};

export const secondaryTextStyles: SxProps<Theme> = {
  color: palette.text.secondary,
  fontSize: "0.8125rem",
};

export const unitCodeChipStyles = (isActive: boolean): SxProps<Theme> => ({
  fontSize: "0.625rem",
  fontWeight: 800,
  color: isActive ? palette.primary.main : palette.text.secondary,
  bgcolor: isActive
    ? alpha(palette.primary.main, 0.08)
    : alpha(palette.text.secondary, 0.08),
  px: 0.6,
  py: 0.1,
  borderRadius: "3px",
  display: "inline-block",
  fontFamily: "'JetBrains Mono', monospace",
  border: `1px solid ${isActive ? alpha(palette.primary.main, 0.1) : alpha(palette.text.secondary, 0.1)}`,
});

export const typeBadgeStyles = (isSavings: boolean): SxProps<Theme> => ({
  display: "inline-flex",
  alignItems: "center",
  px: 1.2,
  py: 0.4,
  borderRadius: "6px",
  fontSize: "0.75rem",
  fontWeight: 700,
  bgcolor: isSavings
    ? alpha(palette.primary.main, 0.08)
    : alpha(palette.secondary.main, 0.08),
  color: isSavings ? palette.primary.main : palette.secondary.main,
  textTransform: "uppercase",
  letterSpacing: "0.02em",
});

export const maskedAccountStyles: SxProps<Theme> = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "0.8125rem",
  color: palette.text.secondary,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "160px",
};

export const branchTextStyles: SxProps<Theme> = {
  fontSize: "0.75rem",
  color: palette.text.secondary,
  mt: 0.2,
};

export const actionButtonStyles: SxProps<Theme> = {
  color: palette.text.secondary,
  "&:hover": {
    color: palette.primary.main,
    bgcolor: alpha(palette.primary.main, 0.08),
  },
};

export const deleteButtonStyles: SxProps<Theme> = {
  color: palette.text.secondary,
  "&:hover": {
    color: palette.error.main,
    bgcolor: alpha(palette.error.main, 0.08),
  },
};
