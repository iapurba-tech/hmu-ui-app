import type { SxProps, Theme } from "@mui/material";
import { palette } from "../../theme";

export const breadcrumbStyles: SxProps<Theme> = {
  mb: 0.5,
  "& .MuiBreadcrumbs-separator": {
    color: palette.neutral.main,
    mx: 0.5,
  },
};

export const breadcrumbItemStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  color: palette.text.secondary,
  textDecoration: "none",
  fontSize: "0.875rem",
  fontWeight: 500,
  "&:hover": {
    color: palette.primary.main,
  },
};

export const activeBreadcrumbStyles: SxProps<Theme> = {
  ...breadcrumbItemStyles,
  color: palette.neutral.main,
  fontWeight: 600,
  pointerEvents: "none",
};
