import { alpha, type SxProps, type Theme } from "@mui/material";

export const baseButtonStyles: SxProps<Theme> = {
  textTransform: "none",
  fontWeight: 700,
  borderRadius: 2,
  boxShadow: "none",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    boxShadow: "none",
  },
  "&:active": {
    transform: "translateY(0)",
  },
};

export const primaryStyles: SxProps<Theme> = {
  ...baseButtonStyles,
  backgroundColor: "primary.main",
  color: "white",
  px: 3,
  py: 1.2,
  "&:hover": {
    backgroundColor: "primary.dark",
    transform: "translateY(-1.5px)",
    boxShadow: (theme) =>
      `0 8px 20px -4px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
};

export const secondaryStyles: SxProps<Theme> = {
  ...baseButtonStyles,
  backgroundColor: "transparent",
  color: "primary.main",
  border: "1px solid",
  borderColor: "primary.main",
  px: 3,
  py: 1.2,
  "&:hover": {
    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
    borderColor: "primary.dark",
    transform: "translateY(-1px)",
  },
};

export const textStyles: SxProps<Theme> = {
  ...baseButtonStyles,
  backgroundColor: "transparent",
  color: "text.secondary",
  px: 2,
  py: 1,
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    color: "text.primary",
  },
};

export const darkStyles: SxProps<Theme> = {
  ...baseButtonStyles,
  bgcolor: "#1e293b", // Dark Slate 800
  color: "white",
  px: 2,
  py: 1,
  fontSize: "13px",
  "&:hover": {
    bgcolor: "#0f172a", // Dark Slate 900
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
    transform: "translateY(-1px)",
  },
  "& .MuiButton-startIcon": {
    color: "rgba(255, 255, 255, 0.7)",
  },
};

export const roundedStyles: SxProps<Theme> = {
  borderRadius: "18px",
};
