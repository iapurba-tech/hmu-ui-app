import { alpha, type SxProps, type Theme } from "@mui/material";
import { outlinedInputStyles as baseOutlinedInputStyles } from "../HmuTextField/HmuTextField.styles";

export const selectStyles: SxProps<Theme> = {
  ...baseOutlinedInputStyles,
  "& .MuiSelect-select": {
    py: 1.6,
    px: 0.5,
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    minHeight: "unset", // Reset MUI default minHeight
    lineHeight: "1.43", // Match HmuTextField line height
  },
};

export const chipStyles: SxProps<Theme> = {
  height: 24,
  fontSize: "0.75rem",
};

export const menuPaperStyles: SxProps<Theme> = {
  borderRadius: "8px",
  mt: 1,
  boxShadow:
    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  border: "1px solid",
  borderColor: "divider",
};

export const menuItemStyles: SxProps<Theme> = {
  fontSize: "14px",
  py: 1,
  px: 1.5,
  mx: 0.5,
  my: 0.25,
  borderRadius: "6px",
  "&.Mui-selected": {
    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
    "&:hover": {
      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
    },
  },
};

export const checkboxStyles: SxProps<Theme> = {
  p: 0.5,
  mr: 1,
};

export const chipContainerStyles: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  gap: 0.5,
};
