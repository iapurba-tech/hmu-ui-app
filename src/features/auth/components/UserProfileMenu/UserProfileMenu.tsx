import React from 'react';
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
  type PaperProps,
} from '@mui/material';
import {
  SettingsRounded as Settings,
  LogoutRounded as Logout,
  PersonRounded as Person,
  MailRounded as Mail,
  SecurityRounded as Security,
  // ManageAccountsRounded as ManageAccounts,
} from '@mui/icons-material';
import {
  menuPaperStyles,
  menuHeaderStyles,
  userInfoBoxStyles,
  userDetailsStackStyles,
  detailItemStyles,
  menuItemStyles,
  signOutItemStyles,
} from './UserProfileMenu.styles';

interface UserData {
  fullName: string;
  username: string;
  email: string;
  role: string;
  avatar?: string;
}

interface UserProfileMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onSettingsClick: () => void;
  onLogoutClick: () => void;
  user: UserData;
}

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  anchorEl,
  open,
  onClose,
  onSettingsClick,
  onLogoutClick,
  user,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      onClick={onClose}
      PaperProps={menuPaperStyles as Partial<PaperProps>}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box sx={menuHeaderStyles}>
        <Box sx={userInfoBoxStyles}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '15px' }}>
              {user.fullName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2, fontWeight: 500 }}>
              @{user.username}
            </Typography>
          </Box>
          <IconButton 
            size="small" 
            onClick={onSettingsClick}
            sx={{ 
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
              '&:hover': { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) }
            }}
          >
            <Settings fontSize="small" color="primary" />
          </IconButton>
        </Box>
        
        <Box sx={userDetailsStackStyles}>
          <Box sx={detailItemStyles}>
            <Box sx={{ color: 'text.secondary', display: 'flex' }}><Mail sx={{ fontSize: 16 }} /></Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {user.email}
            </Typography>
          </Box>
          <Box sx={detailItemStyles}>
            <Box sx={{ color: 'primary.main', display: 'flex' }}><Security sx={{ fontSize: 16 }} /></Box>
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800 }}>
              {user.role}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Divider sx={{ my: 1, opacity: 0.6 }} />
      
      <MenuItem onClick={onSettingsClick} sx={menuItemStyles}>
        <ListItemIcon>
          <Person fontSize="small" />
        </ListItemIcon>
        <ListItemText 
          primary="My Profile" 
          sx={{ variant: 'body2', fontWeight: 600 }} 
        />
      </MenuItem>
      
      <MenuItem onClick={onSettingsClick} sx={menuItemStyles}>
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        <ListItemText 
          primary="Settings" 
          sx={{ variant: 'body2', fontWeight: 600 }} 
        />
      </MenuItem>

      <Divider sx={{ my: 1, opacity: 0.6 }} />

      <MenuItem 
        onClick={onLogoutClick} 
        sx={signOutItemStyles}
      >
        <ListItemIcon>
          <Logout fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText 
          primary="Sign Out" 
          sx={{ variant: 'body2', fontWeight: 700 }} 
        />
      </MenuItem>
    </Menu>
  );
};

export default UserProfileMenu;
