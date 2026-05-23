import { type SxProps, type Theme } from "@mui/material";
import { palette } from "../../../../../shared/theme";

export const dialogStyles: SxProps<Theme> = {
  "& .MuiDialog-paper": {
    borderRadius: "20px",
    maxWidth: "600px",
    width: "100%",
    margin: "16px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
};

export const dialogTitleStyles: SxProps<Theme> = {
  fontWeight: 800,
  fontSize: "1.5rem",
  color: palette.text.primary,
  px: 3,
  pt: 3,
  pb: 2,
};

export const dialogContentStyles: SxProps<Theme> = {
  px: 3,
  pb: 3,
  pt: "8px !important",
  overflowX: "hidden",
};

export const dialogActionsStyles: SxProps<Theme> = {
  padding: "16px 24px",
  gap: 1.5,
};
