import React from "react";
import { Box, Typography } from "@mui/material";
import {
  wsIconBoxStyles,
  wsIdentityBoxStyles,
} from "./WorkspaceIdentity.styles";
import { GlobalIcon, OrganizationIcon } from "../../../../shared/icons";

export interface WorkspaceIdentityProps {
  isAdminWorkspace: boolean;
  unitName?: string;
}

const WorkspaceIdentity: React.FC<WorkspaceIdentityProps> = ({
  isAdminWorkspace,
  unitName,
}) => {
  return (
    <Box sx={wsIdentityBoxStyles}>
      <Box sx={wsIconBoxStyles}>
        {isAdminWorkspace ? (
          <GlobalIcon fontSize="small" />
        ) : (
          <OrganizationIcon fontSize="small" />
        )}
      </Box>
      <Box>
        <Typography
          variant="body2"
          sx={{ fontWeight: 800, color: "text.primary", lineHeight: 1.2 }}
        >
          {isAdminWorkspace ? "HMU Global" : unitName}
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontWeight: 600, color: "primary.main", display: "block" }}
        >
          {isAdminWorkspace ? "Administration Portal" : "Management Portal"}
        </Typography>
      </Box>
    </Box>
  );
};

export default WorkspaceIdentity;
