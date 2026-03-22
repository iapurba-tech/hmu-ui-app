import type { SxProps, Theme } from '@mui/material';
import brandingBg from '../../../../assets/images/branding-bg.png';

export const brandingPanelStyles: SxProps<Theme> = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'primary.main',
  color: 'white',
  p: 10,
  height: '100%',
  width: '100%',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${brandingBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.1,
  },
};
