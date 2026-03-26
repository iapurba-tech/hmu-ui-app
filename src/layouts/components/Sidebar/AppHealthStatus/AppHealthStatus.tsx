import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import { systemHealthBoxStyles } from "../Sidebar.styles";

const AppHealthStatus: React.FC = () => {
  return (
    <Box sx={systemHealthBoxStyles}>
      <Typography
        variant="caption"
        sx={{
          fontWeight: 800,
          color: "primary.main",
          display: "block",
          mb: 1,
        }}
      >
        System Health
      </Typography>
      <LinearProgress
        variant="determinate"
        value={80}
        sx={{
          height: 6,
          borderRadius: 3,
          bgcolor: "rgba(0, 0, 0, 0.05)",
          "& .MuiLinearProgress-bar": { borderRadius: 3 },
        }}
      />
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          mt: 1,
          display: "block",
          fontSize: "10px",
        }}
      >
        All systems operational. 98% uptime this month.
      </Typography>
    </Box>
  );
};

export default AppHealthStatus;
