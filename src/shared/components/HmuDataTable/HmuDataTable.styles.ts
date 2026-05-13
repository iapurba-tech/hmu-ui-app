import type { SxProps, Theme } from "@mui/material";
import { colors } from "../../theme/colors";

export const dataTableContainerStyles = (
  showPagination: boolean,
): SxProps<Theme> => ({
  width: "100%",
  overflowX: "auto",
  backgroundColor: colors.background.paper,
  borderRadius: showPagination ? 0 : "0 0 12px 12px",
  border: `1px solid ${colors.neutral}20`,
  borderTop: "none",
});

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

export const paginationFooterStyles = (
  showPagination: boolean,
): SxProps<Theme> => ({
  bgcolor: "#f8fafc",
  px: 2,
  py: 1.5,
  border: `1px solid ${colors.neutral}20`,
  borderTop: "none",
  borderRadius: "0 0 12px 12px",
  display: showPagination ? "flex" : "none",
  justifyContent: "space-between",
  alignItems: "center",
});

export const rowsPerPageLabelStyles: SxProps<Theme> = {
  fontSize: "0.75rem",
  color: colors.text.secondary,
  fontWeight: 600,
};

export const rowsPerPageSelectStyles: SxProps<Theme> = {
  fontSize: "0.75rem",
  height: "32px",
  borderRadius: "6px",
  bgcolor: "white",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: `${colors.neutral}30`,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: `${colors.neutral}50`,
  },
};

export const paginationIconButtonStyles = (
  type: "previous" | "next",
): SxProps<Theme> => ({
  borderRadius: "8px",
  border: `1px solid ${colors.neutral}20`,
  bgcolor: "white",
  mr: type === "previous" ? 0.5 : 0,
  ml: type === "next" ? 0.5 : 0,
  "&:hover": { bgcolor: "#f1f5f9" },
});

export const paginationItemStyles = (selected: boolean): SxProps<Theme> => ({
  minWidth: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "0.75rem",
  fontWeight: 700,
  mx: 0.25,
  bgcolor: selected ? colors.primary : "transparent",
  color: selected ? "white" : colors.text.primary,
  border: selected ? "none" : `1px solid transparent`,
  "&:hover": {
    bgcolor: selected ? colors.primary : "#f1f5f9",
    border: selected ? "none" : `1px solid ${colors.neutral}20`,
  },
  transition: "all 0.2s",
});
