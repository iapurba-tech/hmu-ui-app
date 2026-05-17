import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Badge,
  Divider,
} from "@mui/material";
import {
  NotificationsIcon,
  SearchIcon,
  SegmentIcon,
  SettingsIcon,
  SwapHorizIcon,
} from "../../../shared/icons";
import { alpha } from "@mui/material/styles";
import { useLayoutStore } from "../../../shared/store/useLayoutStore";
import { useAuthStore } from "../../../shared/store/useAuthStore";
import { UserRole } from "../../../features/auth/constants/roles";
import {
  appBarStyles,
  SearchBox,
  SearchIconWrapper,
  StyledInputBase,
  workspaceButtonStyles,
} from "./TopNav.styles";
import {
  UserProfileMenu,
  WorkspaceModal,
} from "../../../features/auth/components";
import { HmuButton } from "../../../shared/components";

const TopNav: React.FC = () => {
  const navigate = useNavigate();
  const { toggleSidebar, isSidebarOpen } = useLayoutStore();
  const { user, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const open = Boolean(anchorEl);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSettingsClick = () => {
    navigate("/settings");
    handleClose();
  };

  const handleLogoutClick = () => {
    logout();
    navigate("/login");
    handleClose();
  };

  const handleWorkspaceSwitcherOpen = () => {
    setIsSwitcherOpen(true);
  };

  const handleWorkspaceSwitcherClose = () => {
    setIsSwitcherOpen(false);
  };

  const showSwitchButton =
    user?.role === UserRole.SYSTEM_ADMIN ||
    (user?.units && user.units.length > 1);

  const initials = user ? `${user?.firstname[0]}${user?.lastname[0]}` : "";

  return (
    <>
      <AppBar position="fixed" sx={appBarStyles(isSidebarOpen)}>
        <Toolbar sx={{ height: 72 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleSidebar}
            sx={{
              mr: 2,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
              borderRadius: 2,
              color: "primary.main",
              "&:hover": {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <SegmentIcon />
          </IconButton>

          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 800, lineHeight: 1.2, color: "primary.main" }}
              >
                {"HOWRAH MILK UNION"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <SearchBox sx={{ display: { xs: "none", md: "block" } }}>
            <SearchIconWrapper>
              <SearchIcon fontSize="small" />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search data, units or users..."
              inputProps={{ "aria-label": "search" }}
            />
          </SearchBox>

          {showSwitchButton && (
            <Box sx={{ display: { xs: "none", lg: "block" }, mx: 2 }}>
              <Box
                role="button"
                tabIndex={0}
                onClick={handleWorkspaceSwitcherOpen}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleWorkspaceSwitcherOpen();
                  }
                }}
                sx={workspaceButtonStyles}
              >
                <SwapHorizIcon />
                {"Switch Workspace"}
              </Box>
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              sx={{
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                borderRadius: 2,
              }}
            >
              <Badge variant="dot" color="error">
                <NotificationsIcon fontSize="small" color="primary" />
              </Badge>
            </IconButton>
            <IconButton
              onClick={handleSettingsClick}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                borderRadius: 2,
              }}
            >
              <SettingsIcon fontSize="small" color="primary" />
            </IconButton>

            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: 1, height: 32, my: "auto" }}
            />

            <IconButton
              onClick={handleProfileClick}
              sx={{
                p: 0.5,
                border: (theme) =>
                  `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "primary.main",
                  fontSize: "14px",
                  fontWeight: 700,
                }}
              >
                {initials}
              </Avatar>
            </IconButton>

            <UserProfileMenu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onSettingsClick={handleSettingsClick}
              onLogoutClick={handleLogoutClick}
              user={user}
            />
          </Box>
        </Toolbar>
      </AppBar>

      <WorkspaceModal
        open={isSwitcherOpen}
        onClose={handleWorkspaceSwitcherClose}
      />
    </>
  );
};

export default TopNav;
