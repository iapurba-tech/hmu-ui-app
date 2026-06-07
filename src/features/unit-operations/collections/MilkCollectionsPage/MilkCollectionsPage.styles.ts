import { type SxProps, type Theme } from "@mui/material";
import { palette } from "../../../../shared/theme";

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

export const formContainerStyles: SxProps<Theme> = {
  width: "100%",
  backgroundColor: palette.background.paper,
  borderRadius: "12px",
  padding: 3,
  border: `1px solid ${palette.divider}`,
  display: "flex",
  flexDirection: "column",
  gap: 3,
  mb: 1,
};

export const tableContainerStyles: SxProps<Theme> = {
  width: "100%",
};

export const stagingAreaStyles: SxProps<Theme> = {
  mt: 2,
  pt: 2,
  borderTop: `1px solid ${palette.divider}`,
};

export const stagingItemStyles: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 1.5,
  borderRadius: "8px",
  mb: 1,
  backgroundColor: palette.background.default,
  border: `1px solid ${palette.divider}`,
};
