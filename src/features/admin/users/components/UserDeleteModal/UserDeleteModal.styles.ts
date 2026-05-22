import { type SxProps, type Theme, alpha } from "@mui/material";

export const dialogStyles: SxProps<Theme> = {
  "& .MuiDialog-paper": {
    borderRadius: "16px",
    width: "100%",
    maxWidth: "400px",
    p: 1,
  },
};

export const labelStyles: SxProps<Theme> = {
  display: "block",
  mb: 1.5,
  fontWeight: 500,
  color: "text.secondary",
};

export const usernameHighlightStyles: SxProps<Theme> = {
  mb: 2,
  p: 1.5,
  bgcolor: (theme) => alpha(theme.palette.error.main, 0.05),
  border: "1px dashed",
  borderColor: (theme) => alpha(theme.palette.error.main, 0.3),
  borderRadius: "8px",
  textAlign: "center",
};

export const usernameTextStyles: SxProps<Theme> = {
  fontWeight: 700,
  fontFamily: "'JetBrains Mono', monospace",
  color: (theme) => theme.palette.error.main,
  letterSpacing: "0.5px",
};

export const deleteButtonStyles: SxProps<Theme> = {
  flex: 1.5,
  bgcolor: "#ef4444",
  "&:hover": { bgcolor: "#dc2626" },
  "&.Mui-disabled": {
    bgcolor: alpha("#ef4444", 0.3),
    color: alpha("#fff", 0.5),
  },
};
