import { alpha, type SxProps, type Theme } from "@mui/material";

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

export const outlinedInputStyles: SxProps<Theme> = {
  borderRadius: "8px",
  backgroundColor: "white",
  transition: (theme) =>
    theme.transitions.create(["border-color", "box-shadow"]),
  px: 1.5, // Horizontal padding for the root container
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
    boxShadow: (theme) => `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
  },
  "&.Mui-error fieldset": {
    borderColor: "error.main",
  },
  "&.Mui-disabled": {
    backgroundColor: (theme) => alpha(theme.palette.action.disabledBackground, 0.05),
    "& fieldset": {
      borderColor: (theme) => alpha(theme.palette.divider, 0.1),
    },
  },
  "& input": {
    py: 1.6,
    px: 0.5, // Small padding for text when no adornment, or extra buffer
    fontSize: "14px",
    "&::placeholder": {
      color: "text.disabled",
      opacity: 1,
    },
    "&.MuiInputBase-inputAdornedStart": {
      pl: 0, // No extra padding when there's a start adornment
    },
    "&.MuiInputBase-inputAdornedEnd": {
      pr: 0, // No extra padding when there's an end adornment
    },
  },
  "& .MuiInputAdornment-root": {
    color: "text.secondary",
    "&.MuiInputAdornment-positionStart": {
      mr: 0.75, // Tighten gap between start icon and text
    },
    "&.MuiInputAdornment-positionEnd": {
      ml: 0.75, // Tighten gap between text and end icon
    },
  },
};

export const formControlStyles: SxProps<Theme> = {
  width: "100%",
};
