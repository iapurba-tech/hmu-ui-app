import type { SxProps, Theme } from "@mui/material";

export const pageContainerStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export const pageHeaderStyles: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
};

export const pageTitleStyles: SxProps<Theme> = {
  fontWeight: 900,
  letterSpacing: "-0.02em",
};
