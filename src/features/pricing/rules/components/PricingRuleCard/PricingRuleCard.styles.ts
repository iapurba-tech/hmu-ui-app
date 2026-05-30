import { alpha, type Theme } from "@mui/material";

export const getTypeColors = (_type: string) => {
  const color = "primary.main";

  return {
    main: color,
    light: (theme: Theme) => alpha(theme.palette.primary.main, 0.06),
    extraLight: (theme: Theme) => alpha(theme.palette.primary.main, 0.03),
    border: (theme: Theme) => alpha(theme.palette.primary.main, 0.12),
  };
};

export const cardStyles = (_type: string, isEditing: boolean = false) => {
  return {
    borderRadius: "16px",
    border: "1px solid",
    borderColor: "divider",
    bgcolor: "background.paper",
    overflow: "hidden",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    flexDirection: "column",
    height: "auto",
    cursor: isEditing ? "default" : "pointer",
    "&:hover": isEditing
      ? {}
      : {
          transform: "translateY(-4px)",
          boxShadow: (theme: Theme) =>
            `0 12px 24px ${alpha(theme.palette.neutral.main, 0.08)}`,
          borderColor: (theme: Theme) => alpha(theme.palette.neutral.main, 0.2),
        },
  };
};

export const cardHeaderStyles = (type: string) => {
  const colors = getTypeColors(type);
  return {
    p: 2,
    px: 2.5,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    bgcolor: colors.light,
    borderBottom: "1px solid",
    borderBottomColor: colors.border,
  };
};

export const editIconButtonStyles = {
  color: "primary.main",
  "&:hover": {
    bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.06),
  },
};

export const titleStyles = (type: string) => {
  const colors = getTypeColors(type);
  return {
    fontWeight: 700,
    fontSize: "0.75rem",
    color: colors.main,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  };
};

export const rateDisplayContainerStyles = (isEditing: boolean = false) => {
  return {
    px: 3,
    py: 4,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 0.5,
    height: isEditing ? "270px" : "220px",
    justifyContent: "center",
    ...(isEditing && { py: 2 }),
  };
};

export const currentRateLabelStyles = {
  fontSize: "0.65rem",
  fontWeight: 700,
  color: "text.secondary",
  textTransform: "uppercase",
  letterSpacing: "1px",
  mb: 0.5,
};

export const rateValueStyles = {
  fontSize: "2.75rem",
  fontWeight: 800,
  color: "text.primary",
  fontFamily: "'JetBrains Mono', monospace",
  display: "flex",
  alignItems: "baseline",
  gap: 0.5,
  "& .currency": {
    fontSize: "1.25rem",
    color: "text.secondary",
    fontWeight: 500,
  },
};

export const effectiveDateStyles = {
  fontSize: "0.8rem",
  color: "text.secondary",
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  gap: 0.5,
  mt: 1,
  bgcolor: "action.hover",
  px: 1.5,
  py: 0.6,
  borderRadius: "12px",
};

export const actionAreaStyles = {
  p: 1.5,
  pt: 0,
  display: "flex",
  justifyContent: "center",
  height: "50px", // Fixed height for action area
};

export const viewHistoryButtonStyles = {
  fontSize: "0.75rem",
  fontWeight: 700,
  borderRadius: "10px",
  py: 1,
  borderColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.2),
  color: "primary.main",
  "&:hover": {
    bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.04),
    borderColor: "primary.main",
  },
};

export const editHeaderStyles = {
  fontWeight: 700,
  color: "primary.main",
  textTransform: "uppercase",
  mb: 1,
  display: "block",
  textAlign: "center",
  letterSpacing: "0.05em",
};

export const editFormStyles = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 1.5,
  p: 0,
};

export const editButtonCancelStyles = {
  borderColor: "divider",
};
