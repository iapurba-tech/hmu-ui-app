import type { SxProps, Theme } from "@mui/material";
import { colors } from "../../theme/colors";

export const breadcrumbStyles: SxProps<Theme> = {
  mb: 0.5,
  "& .MuiBreadcrumbs-separator": {
    color: colors.neutral,
    mx: 0.5,
  },
};

export const breadcrumbItemStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  color: colors.text.secondary,
  textDecoration: "none",
  fontSize: "0.875rem",
  fontWeight: 500,
  "&:hover": {
    color: colors.primary,
  },
};

export const activeBreadcrumbStyles: SxProps<Theme> = {
  ...breadcrumbItemStyles,
  color: colors.neutral,
  fontWeight: 600,
  pointerEvents: "none",
};
