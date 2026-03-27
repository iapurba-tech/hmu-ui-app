import { type SvgIconProps } from "@mui/material";

// These are the 5 standard styles Google Material Design provides
export type MuiIconVariant =
  | "filled"
  | "outlined"
  | "rounded"
  | "twoTone"
  | "sharp";

export interface VariantIconProps extends SvgIconProps {
  variant?: MuiIconVariant;
}
