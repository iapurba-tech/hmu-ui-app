import { alpha, type SxProps, type Theme } from "@mui/material";

export const snackbarStyles: SxProps<Theme> = {
  "& .MuiSnackbarContent-root": {
    padding: 0,
    backgroundColor: "transparent",
    boxShadow: "none",
  },
};

export const alertStyles = (type: string): SxProps<Theme> => {
  return (theme: Theme) => {
    const severity = (
      type === "info" ||
      type === "success" ||
      type === "warning" ||
      type === "error"
        ? type
        : "info"
    ) as "info" | "success" | "warning" | "error";
    const paletteColor = theme.palette[severity];

    return {
      width: "100%",
      borderRadius: "12px",
      backgroundColor: paletteColor.bg,
      color: paletteColor.text,
      border: `1px solid ${paletteColor.border}`,
      boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`,
      "& .MuiAlert-icon": {
        color: paletteColor.main,
      },
      "& .MuiAlert-message": {
        fontWeight: 600,
        fontSize: "0.875rem",
      },
      padding: "12px 16px",
    };
  };
};
