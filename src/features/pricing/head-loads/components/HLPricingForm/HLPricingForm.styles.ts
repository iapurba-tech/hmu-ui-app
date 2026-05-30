import { alpha, type SxProps, type Theme } from "@mui/material";

export const formCardStyles: SxProps<Theme> = {
  bgcolor: "background.paper",
  borderRadius: "16px",
  border: "1px solid",
  borderColor: "divider",
  overflow: "hidden",
  width: "100%",
};

export const formHeaderStyles: SxProps<Theme> = {
  p: 2,
  px: 2.5,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
  borderBottom: "1px solid",
  borderColor: (theme) => alpha(theme.palette.primary.main, 0.1),
};

export const categoryTitleStyles: SxProps<Theme> = {
  fontWeight: 700,
  fontSize: "0.875rem",
  color: "text.primary",
};

export const codeChipStyles: SxProps<Theme> = {
  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
  color: "primary.main",
  fontWeight: 800,
  fontSize: "0.65rem",
  height: "20px",
  fontFamily: "'JetBrains Mono', monospace",
  "& .MuiChip-label": { px: 1 },
};

export const formContentStyles: SxProps<Theme> = {
  p: 3,
  py: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 2.5,
  minHeight: "280px",
};

export const priceRangeContainerStyles: SxProps<Theme> = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 1.5,
};

export const sectionLabelStyles: SxProps<Theme> = {
  fontWeight: 700,
  fontSize: "0.7rem",
  color: "primary.main",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  mb: 1,
  textAlign: "center",
  display: "block",
};
