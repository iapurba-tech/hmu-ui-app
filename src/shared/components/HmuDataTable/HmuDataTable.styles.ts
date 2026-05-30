import { alpha, type SxProps, type Theme } from "@mui/material";
import { palette } from "../../theme";

export const dataTableContainerStyles = (
  showPagination: boolean,
  hasFilters: boolean,
): SxProps<Theme> => ({
  width: "100%",
  overflowX: "auto",
  backgroundColor: palette.background.paper,
  borderRadius: hasFilters ? 0 : "12px 12px 0 0",
  border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  borderTop: hasFilters
    ? "none"
    : (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  ...(!showPagination && {
    borderRadius: hasFilters ? "0 0 12px 12px" : "12px",
    borderBottom: (theme) =>
      `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  }),
});

export const filterBarStyles: SxProps<Theme> = {
  p: 2,
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  gap: 2,
  alignItems: { xs: "stretch", sm: "center" },
  bgcolor: "white",
  border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  borderRadius: "12px 12px 0 0",
};

export const searchFieldStyles: SxProps<Theme> = {
  flex: 1,
  maxWidth: { sm: 300 },
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    bgcolor: "#f8fafc",
    "& fieldset": {
      borderColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.1),
    },
    "&:hover fieldset": {
      borderColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.2),
    },
    "&.Mui-focused fieldset": {
      borderColor: palette.primary.main,
    },
  },
  "& .MuiInputBase-input": {
    fontSize: "0.875rem",
    py: 1,
  },
};

export const filterSelectStyles: SxProps<Theme> = {
  minWidth: 150,
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    bgcolor: "#f8fafc",
    "& fieldset": {
      borderColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.1),
    },
  },
  "& .MuiSelect-select": {
    fontSize: "0.875rem",
    py: 1,
  },
};

export const searchIconStyles: SxProps<Theme> = {
  color: palette.text.secondary,
  opacity: 0.7,
};

export const dataTableStyles: SxProps<Theme> = {
  width: "100%",
};

export const dataTableHeadCellStyles: SxProps<Theme> = {
  backgroundColor: "#f1f5f9",
  color: palette.text.secondary,
  fontWeight: 700,
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  padding: "12px 16px",
  borderBottom: (theme) =>
    `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  borderRight: (theme) =>
    `1px solid ${alpha(theme.palette.primary.main, 0.05)}`,
  "&:last-child": {
    borderRight: "none",
  },
};

export const dataTableRowStyles: SxProps<Theme> = {
  "&:last-child td, &:last-child th": {
    borderBottom: 0,
  },
  "&:hover": {
    backgroundColor: "#f8fafc",
  },
  transition: "background-color 0.2s",
};

export const dataTableCellStyles: SxProps<Theme> = {
  padding: "12px 16px",
  color: palette.text.primary,
  fontSize: "0.875rem",
  borderBottom: (theme) =>
    `1px solid ${alpha(theme.palette.primary.main, 0.05)}`,
  borderRight: (theme) =>
    `1px solid ${alpha(theme.palette.primary.main, 0.05)}`,
  "&:last-child": {
    borderRight: "none",
  },
};

export const paginationFooterStyles = (
  showPagination: boolean,
): SxProps<Theme> => ({
  bgcolor: "#f8fafc",
  px: 2,
  py: 1.5,
  border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  borderTop: "none",
  borderRadius: "0 0 12px 12px",
  display: showPagination ? "flex" : "none",
  justifyContent: "space-between",
  alignItems: "center",
});

export const rowsPerPageLabelStyles: SxProps<Theme> = {
  fontSize: "0.75rem",
  color: palette.text.secondary,
  fontWeight: 600,
};

export const rowsPerPageSelectStyles: SxProps<Theme> = {
  fontSize: "0.75rem",
  height: "32px",
  borderRadius: "6px",
  bgcolor: "white",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.1),
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.2),
  },
};

export const paginationIconButtonStyles = (
  type: "previous" | "next",
): SxProps<Theme> => ({
  borderRadius: "8px",
  border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
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
  bgcolor: selected ? palette.primary.main : "transparent",
  color: selected ? "white" : palette.text.primary,
  border: selected ? "none" : `1px solid transparent`,
  "&:hover": {
    bgcolor: selected ? palette.primary.main : "#f1f5f9",
    border: selected
      ? "none"
      : (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  },
  transition: "all 0.2s",
});
