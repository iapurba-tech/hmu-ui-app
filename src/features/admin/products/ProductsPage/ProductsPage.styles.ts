import { palette } from "../../../../shared/theme";

export const pageContainerStyles = {
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export const headerStyles = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  justifyContent: "space-between",
  alignItems: { xs: "flex-start", sm: "center" },
  gap: 2,
};

export const titleGroupStyles = {
  display: "flex",
  flexDirection: "column",
  gap: 0.5,
};

export const titleStyles = {
  fontSize: "1.5rem",
  fontWeight: 800,
  color: "text.primary",
  letterSpacing: "-0.02em",
};

export const subtitleStyles = {
  color: palette.text.secondary,
  fontSize: "0.875rem",
  mt: 0.5,
};

export const addButtonStyles = {
  px: 2,
  py: 1,
  borderRadius: "8px",
  height: "fit-content",
};
