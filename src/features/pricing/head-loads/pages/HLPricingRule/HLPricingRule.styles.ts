import { alpha, type SxProps, type Theme } from "@mui/material";

export const pageContainerStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export const headerStyles: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
};

export const titleGroupStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 0.5,
};

export const contentGridStyles: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    lg: "400px 1fr",
  },
  gap: 3,
  alignItems: "flex-start",
};

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
  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06),
  borderBottom: "1px solid",
  borderColor: (theme) => alpha(theme.palette.primary.main, 0.12),
};

export const formTitleStyles: SxProps<Theme> = {
  fontWeight: 700,
  fontSize: "0.75rem",
  color: "primary.main",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

export const formContentStyles: SxProps<Theme> = {
  p: 3,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};
