import { alpha } from "@mui/material";
import { palette } from "../../../../../shared/theme";

export const formContainerStyles = {
  display: "flex",
  flexDirection: "column",
  gap: 3,
  mt: 1,
  maxHeight: "65vh",
  overflowY: "auto",
  px: 0.5,
  // Custom scrollbar for better look
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: alpha(palette.primary.main, 0.1),
    borderRadius: "10px",
    "&:hover": {
      background: alpha(palette.primary.main, 0.2),
    },
  },
};

export const sectionHeaderStyles = {
  mb: 2,
  pb: 1,
  borderBottom: `1px solid ${alpha(palette.primary.main, 0.08)}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

export const sectionLabelStyles = {
  fontSize: "0.75rem",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: palette.primary.main,
};

export const actionContainerStyles = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 2,
  mt: 4,
  pt: 3,
  borderTop: `1px solid ${alpha(palette.neutral.main, 0.12)}`,
};

export const cancelButtonStyles = {
  minWidth: "120px",
};

export const submitButtonStyles = {
  minWidth: "160px",
};

export const categoryBadgeStyles = (category: string) => {
  let color = palette.primary.main;
  let bgColor = alpha(palette.primary.main, 0.1);

  if (category === "FEED") {
    color = "#2e7d32";
    bgColor = "#e8f5e9";
  } else if (category === "STATIONERY") {
    color = "#ed6c02";
    bgColor = "#fff3e0";
  } else if (category === "OTHER") {
    color = "#9c27b0";
    bgColor = "#f3e5f5";
  }

  return {
    fontSize: "0.75rem",
    fontWeight: 700,
    px: 1.5,
    py: 0.5,
    borderRadius: "6px",
    display: "inline-block",
    color,
    bgcolor: bgColor,
    textTransform: "uppercase",
  };
};
