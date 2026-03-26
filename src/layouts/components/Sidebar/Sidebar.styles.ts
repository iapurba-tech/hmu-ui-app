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
