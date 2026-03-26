import React from "react";
import { Box, CircularProgress, Typography, Fade } from "@mui/material";
import {
  loaderContainerStyles,
  progressStyles,
  iconBoxStyles,
  logoPlaceholderStyles,
} from "./HmuLoader.styles";

export interface HmuLoaderProps {
  /**
   * 'fullscreen': Covers the entire viewport
   * 'overlay': Covers the parent container (needs position: relative on parent)
   * 'inline': Standard flex container
   */
  variant?: "fullscreen" | "overlay" | "inline";
  message?: string;
  subMessage?: string;
  size?: number;
}

const HmuLoader: React.FC<HmuLoaderProps> = ({
  variant = "inline",
  message = "Loading...",
  subMessage,
  size = 48,
}) => {
  return (
    <Fade in timeout={400}>
      <Box sx={loaderContainerStyles(variant)}>
        <Box sx={iconBoxStyles}>
          <CircularProgress size={size} thickness={4} sx={progressStyles} />
          <Box sx={logoPlaceholderStyles} />
        </Box>

        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              letterSpacing: "0.02em",
            }}
          >
            {message}
          </Typography>

          {subMessage && (
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                mt: 0.5,
                display: "block",
                fontWeight: 500,
              }}
            >
              {subMessage}
            </Typography>
          )}
        </Box>
      </Box>
    </Fade>
  );
};

export default HmuLoader;
