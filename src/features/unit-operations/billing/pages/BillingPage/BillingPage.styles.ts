import { type SxProps, type Theme } from "@mui/material";
import { palette } from "../../../../../shared/theme";

export const pageContainerStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 3,
  height: "100%",
};

export const pageHeaderStyles: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  flexWrap: "wrap",
  gap: 2,
};

export const pageTitleStyles: SxProps<Theme> = {
  fontWeight: 900,
  color: palette.text.primary,
  letterSpacing: "-0.02em",
};

export const contentGridStyles: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: { xs: "100%", lg: "350px 1fr" },
  gap: 3,
  alignItems: "start",
};

export const sectionPaperStyles: SxProps<Theme> = {
  backgroundColor: palette.background.paper,
  borderRadius: "12px",
  padding: 3,
  border: `1px solid ${palette.divider}`,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};
