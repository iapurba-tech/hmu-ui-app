import type { SxProps, Theme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { DRAWER_WIDTH } from '../../MainLayout/MainLayout.styles';

export const drawerStyles: SxProps<Theme> = {
  width: DRAWER_WIDTH,
  flexShrink: 0,
  [`& .MuiDrawer-paper`]: {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box',
    bgcolor: 'background.paper',
    borderRight: '1px solid',
    borderColor: (theme) => alpha(theme.palette.primary.main, 0.1),
    p: 3,
    pt: 2, // Reduced top padding to move content up
  },
};

export const unitHeaderStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  mb: 4,
  p: 1.5,
  borderRadius: 3,
  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.03),
  border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  height: 72, // Match TopNav height to aid visual alignment
  boxSizing: 'border-box',
};

export const unitIconBoxStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: 2,
  bgcolor: 'primary.main',
  color: 'white',
  boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
};

export const sectionTitleStyles: SxProps<Theme> = {
  px: 2,
  mb: 1,
  display: 'block',
  fontWeight: 800,
  color: 'text.secondary',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  fontSize: '10px',
};

export const listItemButtonStyles = (isSelected: boolean): SxProps<Theme> => ({
  borderRadius: 2,
  px: 2,
  py: 1.2,
  '&.Mui-selected': {
    bgcolor: 'primary.main',
    color: 'white',
    '&:hover': { bgcolor: 'primary.main' },
    '& .MuiListItemIcon-root': { color: 'white' },
  },
  '&:hover': {
    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
    color: isSelected ? 'white' : 'primary.main',
    '& .MuiListItemIcon-root': { color: isSelected ? 'white' : 'primary.main' },
  },
});

export const systemHealthBoxStyles: SxProps<Theme> = {
  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
  borderRadius: 3,
  p: 2,
};
