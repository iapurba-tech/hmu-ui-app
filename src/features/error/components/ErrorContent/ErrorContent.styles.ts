import { Box, Typography, alpha, styled } from "@mui/material";

export const ErrorContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "calc(100vh - 160px)",
  textAlign: "center",
  padding: theme.spacing(4, 2),
}));

export const ContentWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "24px", // 3 * 8
  maxWidth: 512,
  width: "100%",
});

export const IconContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "colorType",
})<{ colorType: "primary" | "error" | "warning" }>(({ theme, colorType }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(3),
  backgroundColor: alpha(theme.palette[colorType].main, 0.1),
  borderRadius: "50%",
  "& .MuiSvgIcon-root": {
    fontSize: 64,
    color: theme.palette[colorType].main,
  },
}));

export const TextContent = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px", // 1 * 8
});

export const Title = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: 800,
  lineHeight: 1.2,
  letterSpacing: "-0.015em",
  color: theme.palette.text.primary,
}));

export const Message = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: 500,
  lineHeight: 1.5,
  color: theme.palette.text.secondary,
  maxWidth: 480,
}));
