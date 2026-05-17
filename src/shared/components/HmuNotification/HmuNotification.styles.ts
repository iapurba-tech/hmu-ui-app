import { alpha, type SxProps, type Theme } from "@mui/material";

export const snackbarStyles: SxProps<Theme> = {
  top: { xs: 16, sm: 24 }, // Add some breathing room from the top
  "& .MuiSnackbarContent-root": {
    padding: 0,
    backgroundColor: "transparent",
    boxShadow: "none",
  },
};

export const alertStyles = (type: string): SxProps<Theme> => {
  return (theme: Theme) => {
    const severity = (type === "info" || type === "success" || type === "warning" || type === "error" ? type : "info") as "info" | "success" | "warning" | "error";
    const paletteColor = theme.palette[severity];

    return {
      minWidth: { xs: "90vw", sm: "450px" },
      maxWidth: "600px",
      borderRadius: "12px",
      backgroundColor: paletteColor.bg,
      color: paletteColor.text,
      border: `1px solid ${paletteColor.border}`,
      boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.08)}`, // Deeper shadow for top placement
      "& .MuiAlert-icon": {
        color: paletteColor.main,
      },
      "& .MuiAlert-message": {
        fontWeight: 600,
        fontSize: "0.875rem",
        textAlign: "center", // Center text for top-center banner
        flex: 1,
      },
      padding: "12px 24px",
    };
  };
};
