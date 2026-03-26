import React from "react";
import { Box, Typography } from "@mui/material";
import { brandingPanelStyles } from "./BrandingPanel.styles";
import { BRANDING_CONTENT } from "../../constants/brand";

const BrandingPanel: React.FC = () => {
  return (
    <Box sx={brandingPanelStyles}>
      <Box sx={{ position: "relative", zIndex: 2, textAlign: "center" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 3,
            justifyContent: "center",
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            {BRANDING_CONTENT.TITLE}
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
          {BRANDING_CONTENT.SLOGAN}
        </Typography>
        <Typography variant="body1" sx={{ marginTop: "20px" }}>
          {BRANDING_CONTENT.DESCRIPTION}
        </Typography>
      </Box>
    </Box>
  );
};

export default BrandingPanel;
