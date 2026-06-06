import { type SxProps, type Theme } from "@mui/material";
import { palette } from "../../../../../shared/theme";

export const formContainerStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  p: 0.5,
};

export const sectionHeaderStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  mb: 2,
  mt: 1,
  "&::after": {
    content: '""',
    flex: 1,
    height: "1px",
    bgcolor: "rgba(0, 0, 0, 0.06)",
  },
};

export const sectionLabelStyles: SxProps<Theme> = {
  fontSize: "0.75rem",
  fontWeight: 800,
  textTransform: "uppercase",
  color: palette.primary.main,
  letterSpacing: "0.1em",
  whiteSpace: "nowrap",
};

export const actionContainerStyles: SxProps<Theme> = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 2,
  mt: 4,
  pt: 2,
  borderTop: "1px solid rgba(0, 0, 0, 0.06)",
};

export const configItemStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  p: 1.5,
  borderRadius: "8px",
  border: "1px solid rgba(0, 0, 0, 0.06)",
  backgroundColor: palette.background.paper,
  "&:hover": {
    borderColor: palette.primary.main,
    backgroundColor: "rgba(0, 0, 0, 0.01)",
  },
};
