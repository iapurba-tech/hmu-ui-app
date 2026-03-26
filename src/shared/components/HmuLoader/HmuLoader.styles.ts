import type { SxProps, Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const loaderContainerStyles = (
  variant: "fullscreen" | "overlay" | "inline",
): SxProps<Theme> => {
  const base: SxProps<Theme> = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  };

  if (variant === "fullscreen") {
    return {
      ...base,
      height: "100vh",
      width: "100vw",
      position: "fixed",
      top: 0,
      left: 0,
      bgcolor: "background.default",
      zIndex: 9999,
    };
  }

  if (variant === "overlay") {
    return {
      ...base,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      bgcolor: (theme) => alpha(theme.palette.background.paper, 0.7),
      backdropFilter: "blur(4px)",
      zIndex: 10,
      borderRadius: "inherit",
    };
  }

  // inline
  return {
    ...base,
    p: 3,
    width: "100%",
  };
};

export const progressStyles: SxProps<Theme> = {
  color: "primary.main",
  "& .MuiCircularProgress-circle": {
    strokeLinecap: "round",
  },
};

export const iconBoxStyles: SxProps<Theme> = {
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

export const logoPlaceholderStyles: SxProps<Theme> = {
  position: "absolute",
  width: 20,
  height: 20,
  bgcolor: "primary.main",
  borderRadius: "50%",
  opacity: 0.8,
  animation: "pulse 1.5s infinite ease-in-out",
  "@keyframes pulse": {
    "0%": { transform: "scale(0.8)", opacity: 0.5 },
    "50%": { transform: "scale(1.2)", opacity: 0.8 },
    "100%": { transform: "scale(0.8)", opacity: 0.5 },
  },
};
