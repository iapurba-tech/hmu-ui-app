import { type SxProps, type Theme } from "@mui/material";
import { palette } from "../../../../../shared/theme";

export const tableWrapperStyles: SxProps<Theme> = {
  flex: 1,
  minHeight: 0,
  "& .MuiPaper-root": {
    borderRadius: "12px",
    border: "1px solid rgba(0, 0, 0, 0.06)",
    overflow: "hidden",
  },
};

export const nameStyles: SxProps<Theme> = {
  fontWeight: 600,
  color: palette.text.primary,
  fontSize: "0.875rem",
};

export const contactStyles: SxProps<Theme> = {
  fontSize: "0.8125rem",
  color: palette.text.secondary,
};

export const statusBadgeStyles = (active: boolean): SxProps<Theme> => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 1,
  px: 1.5,
  py: 0.5,
  borderRadius: "20px",
  fontSize: "0.75rem",
  fontWeight: 700,
  backgroundColor: active ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
  color: active ? palette.success.main : palette.error.main,
  textTransform: "uppercase",
  letterSpacing: "0.02em",
});

export const statusDotStyles = (active: boolean): SxProps<Theme> => ({
  width: 6,
  height: 6,
  borderRadius: "50%",
  backgroundColor: active ? palette.success.main : palette.error.main,
});

export const actionButtonStyles: SxProps<Theme> = {
  color: palette.text.secondary,
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    color: palette.primary.main,
  },
};

export const deleteButtonStyles: SxProps<Theme> = {
  color: palette.text.secondary,
  "&:hover": {
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    color: palette.error.main,
  },
};
