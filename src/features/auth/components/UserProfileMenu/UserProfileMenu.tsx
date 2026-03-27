import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  alpha,
} from "@mui/material";
import {
  LogoutIcon,
  MailIcon,
  PersonIcon,
  SecurityIcon,
  SettingsIcon,
} from "../../../../shared/icons";
import type { UserProfile } from "../../types/auth.types";
import {
  menuPaperStyles,
  menuHeaderStyles,
  userInfoBoxStyles,
  userDetailsStackStyles,
  detailItemStyles,
  menuItemStyles,
  signOutItemStyles,
} from "./UserProfileMenu.styles";
import { UserRole } from "../../constants/roles";

interface UserProfileMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onSettingsClick: () => void;
  onLogoutClick: () => void;
  user: UserProfile | null;
}

const ROLE_DISPLAY_NAMES: Record<string, string> = {
  [UserRole.SYSTEM_ADMIN]: "System Admin",
  [UserRole.UNIT_ADMIN]: "Unit Admin",
  [UserRole.UNIT_MANAGER]: "Unit Manager",
};

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  anchorEl,
  open,
  onClose,
  onSettingsClick,
  onLogoutClick,
  user,
}) => {
  if (!user) return null;

  const fullName = `${user.firstname} ${user.lastname}`;
  const roleDisplayName = ROLE_DISPLAY_NAMES[user.role] || "Guest User";

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      onClick={onClose}
      slotProps={{
        paper: menuPaperStyles as any,
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <Box sx={menuHeaderStyles}>
        <Box sx={userInfoBoxStyles}>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 800, color: "text.primary", fontSize: "15px" }}
            >
              {fullName}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                display: "block",
                mb: 2,
                fontWeight: 500,
              }}
            >
              @{user.username}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={onSettingsClick}
            sx={{
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
              "&:hover": {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <SettingsIcon fontSize="small" color="primary" />
          </IconButton>
        </Box>

        <Box sx={userDetailsStackStyles}>
          <Box sx={detailItemStyles}>
            <Box sx={{ color: "text.secondary", display: "flex" }}>
              <MailIcon sx={{ fontSize: 16 }} />
            </Box>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontWeight: 500 }}
            >
              {user.email}
            </Typography>
          </Box>
          <Box sx={detailItemStyles}>
            <Box sx={{ color: "primary.main", display: "flex" }}>
              <SecurityIcon sx={{ fontSize: 16 }} />
            </Box>
            <Typography
              variant="caption"
              sx={{ color: "primary.main", fontWeight: 800 }}
            >
              {roleDisplayName}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 1, opacity: 0.6 }} />

      <MenuItem onClick={onSettingsClick} sx={menuItemStyles}>
        <ListItemIcon>
          <PersonIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary="My Profile"
          slotProps={{ primary: { variant: "body2", fontWeight: 600 } }}
        />
      </MenuItem>

      <MenuItem onClick={onSettingsClick} sx={menuItemStyles}>
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary="Settings"
          slotProps={{ primary: { variant: "body2", fontWeight: 600 } }}
        />
      </MenuItem>

      <Divider sx={{ my: 1, opacity: 0.6 }} />

      <MenuItem onClick={onLogoutClick} sx={signOutItemStyles}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText
          primary="Sign Out"
          slotProps={{ primary: { variant: "body2", fontWeight: 700 } }}
        />
      </MenuItem>
    </Menu>
  );
};

export default UserProfileMenu;
