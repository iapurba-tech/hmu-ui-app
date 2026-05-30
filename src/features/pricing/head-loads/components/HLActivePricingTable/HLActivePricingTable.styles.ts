import { alpha, type SxProps, type Theme } from "@mui/material";

export const tableCardStyles: SxProps<Theme> = {
  bgcolor: "background.paper",
  borderRadius: "16px",
  border: "1px solid",
  borderColor: "divider",
  overflow: "hidden",
  width: "100%",
};

export const sectionHeaderStyles: SxProps<Theme> = {
  p: 2,
  px: 2.5,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid",
  borderColor: "divider",
};

export const sectionTitleStyles: SxProps<Theme> = {
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "primary.main",
};

export const loaderContainerStyles: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  p: 4,
};

export const tableHeaderRowStyles: SxProps<Theme> = {
  bgcolor: (theme) =>
    theme.palette.mode === "light" ? "#f8fafc" : "rgba(255,255,255,0.02)",
};

export const tableHeaderCellStyles: SxProps<Theme> = {
  fontWeight: 700,
  fontSize: "0.7rem",
  textTransform: "uppercase",
  py: 1.5,
};

export const emptyCellStyles: SxProps<Theme> = {
  py: 4,
  color: "text.secondary",
  fontSize: "0.875rem",
};

export const categoryRowStyles: SxProps<Theme> = {
  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.01),
};

export const categoryCellStyles: SxProps<Theme> = {
  py: 1,
  borderLeft: "3px solid",
  borderLeftColor: "primary.main",
};

export const categoryTitleStyles: SxProps<Theme> = {
  fontWeight: 800,
  color: "text.primary",
  textTransform: "uppercase",
};

export const priceRowStyles: SxProps<Theme> = {
  "&:hover": { bgcolor: "action.hover" },
};

export const rangeCellStyles: SxProps<Theme> = {
  pl: 3,
  color: "text.secondary",
  fontSize: "0.75rem",
};

export const monoTextStyles: SxProps<Theme> = {
  fontWeight: 600,
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "0.8rem",
};

export const rateTextStyles: SxProps<Theme> = {
  fontWeight: 700,
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "0.8rem",
  color: "primary.main",
};
