import { type SxProps, type Theme } from "@mui/material";
import { palette } from "../../../../shared/theme";

export const pageContainerStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 3,
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
