import type { SxProps, Theme } from '@mui/material';
import { alpha } from '@mui/material/styles';

export const modalOverlayStyles: SxProps<Theme> = {
  backdropFilter: 'blur(6px)',
  backgroundColor: 'rgba(15, 23, 42, 0.3)', // slate-900/30
};

export const modalContainerStyles: SxProps<Theme> = {
  width: '100%',
  maxWidth: 580,
  height: '90vh',
  maxHeight: '90vh',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(12px)',
  borderRadius: '32px',
  boxShadow: '0 32px 64px -16px rgba(0,0,0,0.15)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid rgba(255, 255, 255, 0.6)',
  outline: 'none',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

export const headerStyles: SxProps<Theme> = {
  p: 4,
  pb: 2,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
};

export const technicalLabelStyles: SxProps<Theme> = {
  fontSize: '10px',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.15em',
  color: '#0077b8',
};

export const searchContainerStyles: SxProps<Theme> = {
  px: 4,
  py: 1,
};

export const searchInputStyles: SxProps<Theme> = {
  width: '100%',
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '18px',
    '& fieldset': {
      borderColor: '#e2e8f0',
    },
    '&:hover fieldset': {
      borderColor: '#cbd5e1',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0077b8',
      borderWidth: '2px',
    },
  },
  '& .MuiInputBase-input': {
    py: 1.5,
    fontSize: '14px',
    fontWeight: 500,
  },
};

export const unitListStyles: SxProps<Theme> = {
  px: 4,
  py: 3,
  flex: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: '10px',
  },
};

export const unitCardStyles = (selected: boolean, color: string): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'center',
  p: 2.5,
  backgroundColor: selected ? alpha(color, 0.03) : 'rgba(255, 255, 255, 0.4)',
  borderRadius: '20px',
  border: `2px solid ${selected ? color : 'rgba(241, 245, 249, 0.5)'}`,
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  '&:hover': {
    borderColor: selected ? color : alpha(color, 0.3),
    backgroundColor: selected ? alpha(color, 0.05) : 'rgba(255, 255, 255, 0.6)',
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 20px -8px ${alpha(color, 0.2)}`,
  },
});

export const iconBoxStyles = (color: string): SxProps<Theme> => ({
  width: 56,
  height: 56,
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha(color, 0.1),
  color: color,
  flexShrink: 0,
});

export const footerStyles: SxProps<Theme> = {
  p: 4,
  pt: 2,
  backgroundColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderTop: '1px solid rgba(241, 245, 249, 0.8)',
};

export const confirmButtonStyles: SxProps<Theme> = {
  px: 4,
  py: 1.75,
  backgroundColor: '#0077b8',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 800,
  borderRadius: '18px',
  textTransform: 'none',
  boxShadow: '0 12px 24px -8px rgba(0, 119, 184, 0.4)',
  gap: 1.5,
  '&:hover': {
    backgroundColor: '#004a75',
    transform: 'translateY(-2px)',
    boxShadow: '0 16px 32px -12px rgba(0, 119, 184, 0.5)',
  },
  transition: 'all 0.3s ease',
};
