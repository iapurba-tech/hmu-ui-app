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
  Button,
} from "@mui/material";
import {
  SearchRounded as Search,
  NotificationsRounded as Notifications,
  SettingsRounded as Settings,
  SwapHorizRounded as SwapHoriz,
  SegmentRounded as Segment,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import { useLayoutStore } from "../../../shared/store/useLayoutStore";
import { useAuthStore } from "../../../shared/store/useAuthStore";
import {
  appBarStyles,
  SearchBox,
  SearchIconWrapper,
  StyledInputBase,
  switchButtonStyle,
} from "./TopNav.styles";
import {
  UserProfileMenu,
  UnitSelectionModal,
} from "../../../features/auth/components";

const TopNav: React.FC = () => {
  const navigate = useNavigate();
  const { toggleSidebar, isSidebarOpen } = useLayoutStore();
  const { user, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);

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

  const handleUnitModalOpen = () => {
    setIsUnitModalOpen(true);
  };

  const handleUnitModalClose = () => {
    setIsUnitModalOpen(false);
  };

  console.log("User Profile:", user);

  const showSwitchButton =
    user?.role === "ROLE_SYSTEM_ADMIN" ||
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
            <Segment />
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
                HOWRAH MILK UNION
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <SearchBox sx={{ display: { xs: "none", md: "block" } }}>
            <SearchIconWrapper>
              <Search fontSize="small" />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search data, units or users..."
              inputProps={{ "aria-label": "search" }}
            />
          </SearchBox>

          {showSwitchButton && (
            <Box sx={{ display: { xs: "none", lg: "block" }, mx: 2 }}>
              <Button
                variant="text"
                startIcon={<SwapHoriz />}
                sx={switchButtonStyle}
                onClick={handleUnitModalOpen}
              >
                {"Switch Workspace"}
              </Button>
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
                <Notifications fontSize="small" color="primary" />
              </Badge>
            </IconButton>
            <IconButton
              onClick={handleSettingsClick}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                borderRadius: 2,
              }}
            >
              <Settings fontSize="small" color="primary" />
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

      <UnitSelectionModal
        open={isUnitModalOpen}
        onClose={handleUnitModalClose}
      />
    </>
  );
};

export default TopNav;
