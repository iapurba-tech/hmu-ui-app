import React from 'react';
import { Box, Typography, Button, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LockRounded as Lock } from '@mui/icons-material';

const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 160px)', // Adjust for header/footer
        textAlign: 'center',
        px: 4,
        py: 8,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, maxWidth: 512, w: '100%' }}>
        {/* Icon Container */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            borderRadius: '50%',
          }}
        >
          <Lock sx={{ fontSize: 64, color: 'primary.main' }} />
        </Box>

        {/* Text Content */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontSize: '1.5rem', 
              fontWeight: 800, 
              lineHeight: 1.2, 
              letterSpacing: '-0.015em',
              color: 'text.primary' 
            }}
          >
            403 Access Denied
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: '1rem', 
              fontWeight: 500, 
              lineHeight: 1.5, 
              color: 'text.secondary',
              maxWidth: 480 
            }}
          >
            Sorry, you do not have the required permissions to access this page or perform this action. Your user role may not grant you access to this resource.
          </Typography>
        </Box>

        {/* Action Button */}
        <Button
          variant="contained"
          onClick={() => navigate('/dashboard')}
          sx={{ 
            minWidth: 84,
            height: 40,
            px: 3,
            borderRadius: 2,
            bgcolor: 'primary.main',
            color: 'white',
            textTransform: 'none',
            fontSize: '0.875rem',
            fontWeight: 700,
            '&:hover': {
              bgcolor: (theme) => theme.palette.primary.dark,
            },
            boxShadow: 'none',
          }}
        >
          Return to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default ForbiddenPage;
