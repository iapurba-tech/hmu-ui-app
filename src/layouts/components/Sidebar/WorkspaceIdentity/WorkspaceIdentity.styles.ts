import { alpha, type SxProps, type Theme } from "@mui/material";

export const wsIdentityBoxStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  mb: 4,
  p: 1.5,
  borderRadius: 3,
  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.03),
  border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  height: 72,
  boxSizing: "border-box",
};

export const wsIconBoxStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: 2,
  bgcolor: "primary.main",
  color: "white",
  boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
};
