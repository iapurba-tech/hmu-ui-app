import type { SxProps, Theme } from '@mui/material';
import { alpha } from '@mui/material/styles';

export const menuPaperStyles: SxProps<Theme> = {
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
};

export const menuHeaderStyles: SxProps<Theme> = {
  px: 2,
  py: 1.5,
};

export const userInfoBoxStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
};

export const userDetailsStackStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
};

export const detailItemStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
};

export const menuItemStyles: SxProps<Theme> = {
  py: 1.2,
  borderRadius: 2,
};

export const signOutItemStyles: SxProps<Theme> = {
  py: 1.2,
  borderRadius: 2,
  color: 'error.main',
  '&:hover': {
    bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
  },
};
