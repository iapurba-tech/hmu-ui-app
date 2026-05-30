import { alpha, type SxProps, type Theme } from "@mui/material";

export const datePickerStyles: SxProps<Theme> = {
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "white",
    transition: (theme) =>
      theme.transitions.create(["border-color", "box-shadow"]),
    "& fieldset": {
      borderColor: (theme) => alpha(theme.palette.divider, 0.3),
      borderWidth: "1px",
      top: 0,
      "& legend": {
        display: "none",
      },
    },
    "&:hover fieldset": {
      borderColor: (theme) => alpha(theme.palette.primary.main, 0.4),
    },
    "&.Mui-focused fieldset": {
      borderColor: "primary.main",
      borderWidth: "1px !important",
      boxShadow: (theme) =>
        `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
    },
    "&.Mui-error fieldset": {
      borderColor: "error.main",
    },
    "&.Mui-disabled": {
      backgroundColor: (theme) =>
        alpha(theme.palette.action.disabledBackground, 0.05),
      "& fieldset": {
        borderColor: (theme) => alpha(theme.palette.divider, 0.1),
      },
    },
    "& .MuiInputBase-input": {
      py: 1.6,
      px: 1.5,
      fontSize: "14px",
      "&::placeholder": {
        color: "text.disabled",
        opacity: 1,
      },
    },
  },
};

export const labelStyles: SxProps<Theme> = {
  mb: 1,
  display: "block",
  fontSize: "14px",
  fontWeight: 600,
  color: "text.primary",
  "&.Mui-error": {
    color: "error.main",
  },
  "& .MuiFormLabel-asterisk": {
    color: "error.main",
  },
};
