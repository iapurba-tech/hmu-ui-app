import type { SxProps, Theme } from "@mui/material";

export const loginFormContainerStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "background.default",
  width: "100%",
  height: "100%",
};

export const headerBoxStyles: SxProps<Theme> = {
  mb: 3,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};

export const loginFormBoxStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: 450,
  px: 4,
};

export const formContainerStyles: SxProps<Theme> = {
  mt: 1,
  width: "100%",
};

export const actionRowStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  mb: 3,
};

export const footerTextStyles: SxProps<Theme> = {
  display: "block",
  mt: 4,
  textAlign: "center",
};
