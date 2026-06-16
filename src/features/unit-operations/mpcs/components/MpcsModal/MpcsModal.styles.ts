import { type SxProps, type Theme } from "@mui/material";
import { palette } from "../../../../../shared/theme";

export const dialogStyles: SxProps<Theme> = {
  "& .MuiDialog-paper": {
    borderRadius: "16px",
    width: "100%",
    maxWidth: "800px",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
};

export const dialogTitleStyles: SxProps<Theme> = {
  p: 3,
  pb: 2,
  fontWeight: 700,
  fontSize: "1.25rem",
  color: palette.text.primary,
};

export const dialogContentStyles: SxProps<Theme> = {
  p: 3,
  pt: 1,
};
