import type { SxProps, Theme } from "@mui/material";
import { colors } from "../../theme/colors";

export const dataTableContainerStyles: SxProps<Theme> = {
  width: "100%",
  overflowX: "auto",
  backgroundColor: colors.background.paper,
  borderRadius: "0 0 12px 12px",
  border: `1px solid ${colors.neutral}20`,
  borderTop: "none",
};

export const dataTableStyles: SxProps<Theme> = {
  minWidth: 650,
};

export const dataTableHeadCellStyles: SxProps<Theme> = {
  backgroundColor: "#f1f5f9", // bg-surface-variant
  color: colors.text.secondary,
  fontWeight: 700,
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  padding: "12px 16px",
  borderBottom: `1px solid ${colors.neutral}20`,
};

export const dataTableRowStyles: SxProps<Theme> = {
  "&:last-child td, &:last-child th": { border: 0 },
  "&:hover": {
    backgroundColor: "#f8fafc",
  },
  transition: "background-color 0.2s",
};

export const dataTableCellStyles: SxProps<Theme> = {
  padding: "12px 16px",
  color: colors.text.primary,
  fontSize: "0.875rem",
  borderBottom: `1px solid ${colors.neutral}10`,
};
