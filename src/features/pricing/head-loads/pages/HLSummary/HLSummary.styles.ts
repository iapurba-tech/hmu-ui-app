import { type SxProps, type Theme } from "@mui/material";

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

export const titleStyles: SxProps<Theme> = {
  fontWeight: 800,
  color: "text.primary",
  letterSpacing: "-0.02em",
};

export const subtitleStyles: SxProps<Theme> = {
  color: "text.secondary",
  maxWidth: 600,
};

export const dashboardGridStyles: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    lg: "1.4fr 1fr",
  },
  gap: 3,
  alignItems: "flex-start",
};

export const tableCardStyles: SxProps<Theme> = {
  bgcolor: "background.paper",
  borderRadius: "16px",
  border: "1px solid",
  borderColor: "divider",
  overflow: "hidden",
};

export const sectionHeaderStyles: SxProps<Theme> = {
  p: 2,
  px: 2.5,
  bgcolor: (theme: Theme) =>
    theme.palette.mode === "light" ? "#f8fafc" : "rgba(255, 255, 255, 0.05)",
  borderBottom: "1px solid",
  borderColor: "divider",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
