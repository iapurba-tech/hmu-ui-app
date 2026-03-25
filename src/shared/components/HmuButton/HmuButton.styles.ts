import type { SxProps, Theme } from '@mui/material';

export const hmuButtonStyles: SxProps<Theme> = {
  textTransform: 'none',
  fontWeight: 700,
  borderRadius: 2,
  boxShadow: 'none',
  py: 1.2,
  px: 3,
  '&:hover': {
    boxShadow: 'none',
  },
};

export const primaryStyles: SxProps<Theme> = {
  ...hmuButtonStyles,
  backgroundColor: 'primary.main',
  color: 'white',
  '&:hover': {
    backgroundColor: 'primary.dark',
  },
};

export const secondaryStyles: SxProps<Theme> = {
  ...hmuButtonStyles,
  backgroundColor: 'transparent',
  color: 'primary.main',
  border: '1px solid',
  borderColor: 'primary.main',
  '&:hover': {
    backgroundColor: 'rgba(37, 99, 235, 0.04)',
    borderColor: 'primary.dark',
  },
};
