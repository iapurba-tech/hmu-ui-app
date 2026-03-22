import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  SearchRounded as Search,
  NotificationsRounded as Notifications,
  SettingsRounded as Settings,
  SwapHorizRounded as SwapHoriz,
  SegmentRounded as Segment,
  LogoutRounded as Logout,
  PersonRounded as Person,
  MailRounded as Mail,
  SecurityRounded as Security,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { useLayoutStore } from '../../../shared/store/useLayoutStore';
import {
  appBarStyles,
  SearchBox,
  SearchIconWrapper,
  StyledInputBase,
  switchButtonStyle,
} from './TopNav.styles';

const TopNav: React.FC = () => {
  const navigate = useNavigate();
  const { toggleSidebar, isSidebarOpen, portal, setPortal } = useLayoutStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    handleClose();
  };

  const handlePortalSwitch = () => {
    setPortal(portal === 'admin' ? 'management' : 'admin');
  };

  // Mock user data - in a real app, this would come from an auth hook/store
  const user = {
    fullName: 'Apurba Panja',
    username: 'apurba.admin',
    email: 'apurba@hmu.gov.in',
    role: portal === 'admin' ? 'System Administrator' : 'Unit Manager',
    avatar: '', // Path to avatar image
  };

  return (
    <AppBar
      position="fixed"
      sx={appBarStyles(isSidebarOpen)}
    >
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
            color: 'primary.main',
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            }
          }}
        >
          <Segment />
        </IconButton>

        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2, color: 'primary.main' }}>
              HOWRAH MILK UNION
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <SearchBox sx={{ display: { xs: 'none', md: 'block' } }}>
          <SearchIconWrapper>
            <Search fontSize="small" />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search data, units or users..."
            inputProps={{ 'aria-label': 'search' }}
          />
        </SearchBox>

        <Box sx={{ display: { xs: 'none', lg: 'block' }, mx: 2 }}>
          <Button
            variant="text"
            startIcon={<SwapHoriz />}
            sx={switchButtonStyle}
            onClick={handlePortalSwitch}
          >
            Switch to {portal === 'admin' ? 'Management' : 'Admin'}
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
            <Badge variant="dot" color="error">
              <Notifications fontSize="small" color="primary" />
            </Badge>
          </IconButton>
          <IconButton 
            onClick={handleSettingsClick}
            sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}
          >
            <Settings fontSize="small" color="primary" />
          </IconButton>
          
          <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 32, my: 'auto' }} />

          <IconButton 
            onClick={handleProfileClick}
            sx={{ 
              p: 0.5, 
              border: (theme) => `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
              }
            }}
          >
            <Avatar
              src={user.avatar}
              sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '14px', fontWeight: 700 }}
            >
              {user.fullName.split(' ').map(n => n[0]).join('')}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                width: 280,
                overflow: 'visible',
                filter: 'drop-shadow(0px 8px 24px rgba(0,0,0,0.12))',
                mt: 1.5,
                borderRadius: 4,
                border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                p: 1,
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
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
                  onClick={handleSettingsClick}
                  sx={{ 
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                    '&:hover': { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) }
                  }}
                >
                  <Settings fontSize="small" color="primary" />
                </IconButton>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ color: 'text.secondary', display: 'flex' }}><Mail sx={{ fontSize: 16 }} /></Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    {user.email}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ color: 'primary.main', display: 'flex' }}><Security sx={{ fontSize: 16 }} /></Box>
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800 }}>
                    {user.role}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Divider sx={{ my: 1, opacity: 0.6 }} />
            
            <MenuItem onClick={handleSettingsClick} sx={{ py: 1.2, borderRadius: 2 }}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="My Profile" 
                primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }} 
              />
            </MenuItem>
            
            <MenuItem onClick={handleSettingsClick} sx={{ py: 1.2, borderRadius: 2 }}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Settings" 
                primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }} 
              />
            </MenuItem>

            <Divider sx={{ my: 1, opacity: 0.6 }} />

            <MenuItem 
              onClick={handleClose} 
              sx={{ 
                py: 1.2, 
                borderRadius: 2,
                color: 'error.main',
                '&:hover': { bgcolor: (theme) => alpha(theme.palette.error.main, 0.08) }
              }}
            >
              <ListItemIcon>
                <Logout fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText 
                primary="Sign Out" 
                primaryTypographyProps={{ variant: 'body2', fontWeight: 700 }} 
              />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNav;
