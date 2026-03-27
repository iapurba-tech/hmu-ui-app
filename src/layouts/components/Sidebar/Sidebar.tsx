import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useLayoutStore } from "../../../shared/store/useLayoutStore";
import { useAuthStore } from "../../../shared/store/useAuthStore";
import WorkspaceIdentity from "./WorkspaceIdentity/WorkspaceIdentity";
import AppHealthStatus from "./AppHealthStatus/AppHealthStatus";
import {
  drawerStyles,
  sectionTitleStyles,
  listItemButtonStyles,
} from "./Sidebar.styles";
import { WorkspaceType } from "../../../features/auth/constants/workspace";
import { adminMenu, managementMenu } from "./Sidebar.config";
import { getRouteTitle } from "../../../app/router/routeUtils";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isSidebarOpen } = useLayoutStore();
  const { workspace, activeUnit } = useAuthStore();

  const isAdminWorkspace = workspace === WorkspaceType.SYSTEM_ADMIN;
  const sections = isAdminWorkspace ? adminMenu : managementMenu;

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={isSidebarOpen}
      role="navigation"
      sx={drawerStyles}
    >
      <WorkspaceIdentity
        isAdminWorkspace={isAdminWorkspace}
        unitName={activeUnit?.name}
      />

      {sections.map((section) => (
        <Box key={section.title} sx={{ mb: 3 }}>
          <Typography variant="caption" sx={sectionTitleStyles}>
            {section.title}
          </Typography>
          <List disablePadding>
            {section.items.map((item) => {
              const routeTitle = getRouteTitle(item.path);
              const isCurrentRoute = location.pathname === item.path;
              return (
                <ListItem key={routeTitle} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    selected={isCurrentRoute}
                    sx={listItemButtonStyles(isCurrentRoute)}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: isCurrentRoute ? "white" : "text.secondary",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={routeTitle}
                      sx={{
                        fontSize: "14px",
                        fontWeight: 700,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      ))}

      <Box sx={{ flexGrow: 1 }} />

      <AppHealthStatus />
    </Drawer>
  );
};

export default Sidebar;
