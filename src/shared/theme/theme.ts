import { createTheme } from "@mui/material/styles";
import { palette } from "./palette";

// Extend the Palette interface to include custom colors and additional fields
declare module "@mui/material/styles" {
  interface PaletteColor {
    bg?: string;
    border?: string;
    text?: string;
  }
  interface SimplePaletteColorOptions {
    bg?: string;
    border?: string;
    text?: string;
  }
  interface Palette {
    tertiary: Palette["primary"];
    neutral: Palette["primary"];
    info: Palette["primary"];
    success: Palette["primary"];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions["primary"];
    neutral?: PaletteOptions["primary"];
    info?: PaletteOptions["primary"];
    success?: PaletteOptions["primary"];
  }
}

export const theme = createTheme({
  palette,
  typography: {
    fontFamily:
      '"Inter", "Work Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 900 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    subtitle1: { fontWeight: 700 },
    body2: { fontWeight: 500 },
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
  },
});
