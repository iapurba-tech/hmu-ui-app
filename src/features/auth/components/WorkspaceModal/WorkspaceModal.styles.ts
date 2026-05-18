import type { SxProps, Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const modalOverlayStyles: SxProps<Theme> = {
  backdropFilter: "blur(6px)",
  backgroundColor: "rgba(15, 23, 42, 0.3)", // slate-900/30
};

export const modalContainerStyles: SxProps<Theme> = {
  width: "100%",
  maxWidth: 580,
  maxHeight: "85vh",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(12px)",
  borderRadius: "32px",
  boxShadow: "0 32px 64px -16px rgba(0,0,0,0.15)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  border: "1px solid rgba(255, 255, 255, 0.6)",
  outline: "none",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

export const headerStyles: SxProps<Theme> = {
  p: 4,
  pb: 2,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
};

export const headerTitleSectionStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  mb: 1,
};

export const headerAccentStyles: SxProps<Theme> = {
  width: 4,
  height: 18,
  bgcolor: "#0077b8",
  borderRadius: 1,
};

export const headerTitleStyles: SxProps<Theme> = {
  color: "#0f172a",
  fontWeight: 900,
  letterSpacing: "-0.02em",
};

export const headerSubtitleStyles: SxProps<Theme> = {
  color: "#64748b",
  mt: 0.5,
  fontWeight: 500,
};

export const closeButtonStyles: SxProps<Theme> = {
  color: "#94a3b8",
  "&:hover": { bgcolor: "#f1f5f9", color: "#0f172a" },
  borderRadius: "14px",
  p: 1.5,
};

export const technicalLabelStyles: SxProps<Theme> = {
  fontSize: "10px",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.15em",
  color: "#0077b8",
};

export const searchContainerStyles: SxProps<Theme> = {
  px: 4,
  py: 1,
};

export const searchInputStyles: SxProps<Theme> = {
  width: "100%",
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: "18px",
    "& fieldset": {
      borderColor: "#e2e8f0",
    },
    "&:hover fieldset": {
      borderColor: "#cbd5e1",
    },
    "&.Mui-focused fieldset": {
      borderColor: (theme) => theme.palette.primary.main,
      borderWidth: "2px",
    },
  },
  "& .MuiInputBase-input": {
    py: 1.5,
    fontSize: "14px",
    fontWeight: 500,
  },
};

export const unitListStyles: SxProps<Theme> = {
  px: 4,
  py: 3,
  flex: 1,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: 2,
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: "10px",
  },
};

export const unitCardStyles =
  (
    selected: boolean,
    isGlobal: boolean,
    isActive: boolean = true,
  ): SxProps<Theme> =>
  (theme) => {
    let baseColor = isActive
      ? theme.palette.primary.main
      : theme.palette.error.main;
    if (isGlobal) baseColor = "#4F46E5"; // Deep Indigo for Global

    return {
      display: "flex",
      alignItems: "flex-start",
      p: 2.5,
      backgroundColor: selected
        ? alpha(baseColor, 0.04)
        : "rgba(255, 255, 255, 0.4)",
      borderRadius: "20px",
      border: `2px solid ${selected ? baseColor : "rgba(241, 245, 249, 0.5)"}`,
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "relative",
      "&:hover": {
        borderColor: baseColor,
        backgroundColor: selected
          ? alpha(baseColor, 0.05)
          : alpha(baseColor, 0.02),
        transform: "translateY(-2px)",
        boxShadow: `0 8px 20px -8px ${alpha(baseColor, 0.25)}`,
      },
      ...(!isActive &&
        !isGlobal && {
          backgroundColor: selected
            ? alpha(baseColor, 0.06)
            : alpha(baseColor, 0.02),
          borderColor: selected ? baseColor : alpha(baseColor, 0.2),
        }),
    };
  };

export const iconBoxStyles =
  (isGlobal: boolean, isActive: boolean = true): SxProps<Theme> =>
  (theme) => {
    let color = isActive
      ? theme.palette.primary.main
      : theme.palette.error.main;
    if (isGlobal) color = "#4F46E5";

    return {
      width: 56,
      height: 56,
      borderRadius: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: alpha(color, 0.1),
      color: color,
      flexShrink: 0,
      mt: 0.5,
    };
  };

export const unitCardContentStyles: SxProps<Theme> = {
  ml: 2.5,
  flex: 1,
};

export const unitCardHeaderStyles: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 0.5,
};

export const unitNameStyles: SxProps<Theme> = {
  fontWeight: 800,
  color: "#0f172a",
  fontSize: "1rem",
};

export const unitMetaContainerStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
};

export const unitCodeBadgeStyles =
  (isGlobal: boolean, isActive: boolean): SxProps<Theme> =>
  (theme) => {
    let color = isActive
      ? theme.palette.primary.main
      : theme.palette.error.main;
    if (isGlobal) color = "#4F46E5";

    return {
      fontSize: "9px",
      fontWeight: 800,
      color: color,
      bgcolor: alpha(color, 0.08),
      px: 1,
      py: 0.25,
      borderRadius: "12px",
      letterSpacing: "0.05em",
      border: `1px solid ${alpha(color, 0.1)}`,
    };
  };

export const unitStatusBadgeStyles =
  (isActive: boolean): SxProps<Theme> =>
  (theme) => {
    const statusPalette = isActive
      ? theme.palette.success
      : theme.palette.error;
    return {
      fontSize: "9px",
      fontWeight: 800,
      color: statusPalette.text,
      bgcolor: statusPalette.bg,
      px: 1,
      py: 0.25,
      borderRadius: "12px",
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      border: `1px solid ${statusPalette.border}`,
      display: "flex",
      alignItems: "center",
      gap: 0.5,
    };
  };

export const statusDotStyles =
  (isActive: boolean): SxProps<Theme> =>
  (theme) => ({
    width: 6,
    height: 6,
    borderRadius: "50%",
    bgcolor: isActive ? theme.palette.success.main : theme.palette.error.main,
  });

export const unitDotSeparatorStyles: SxProps<Theme> = {
  width: 4,
  height: 4,
  borderRadius: "50%",
  bgcolor: "#cbd5e1",
};

export const unitStatsContainerStyles: SxProps<Theme> = {
  mt: 2,
  display: "flex",
  gap: 4,
  pt: 1.5,
  borderTop: "1px solid rgba(241, 245, 249, 0.8)",
};

export const statLabelStyles: SxProps<Theme> = {
  fontSize: "8px",
  fontWeight: 800,
  color: "#94a3b8",
  mb: 0.5,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
};

export const statValueStyles: SxProps<Theme> = {
  fontWeight: 800,
  color: "#334155",
  fontSize: "0.875rem",
};

export const footerStyles: SxProps<Theme> = {
  p: 4,
  pt: 2,
  backgroundColor: "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderTop: "1px solid rgba(241, 245, 249, 0.8)",
};

export const secureAccessBadgeStyles: SxProps<Theme> = {
  width: 42,
  height: 42,
  borderRadius: "14px",
  bgcolor: "#ffffff",
  border: "1px solid #e2e8f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#0077b8",
  boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
};
