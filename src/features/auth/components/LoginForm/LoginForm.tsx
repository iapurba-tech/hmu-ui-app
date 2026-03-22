import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Link,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  PersonRounded as Person,
  LockRounded as Lock,
  VisibilityRounded as Visibility,
  VisibilityOffRounded as VisibilityOff,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  loginFormContainerStyles,
  headerBoxStyles,
  loginFormBoxStyles,
  formContainerStyles,
  textFieldStyles,
  actionRowStyles,
  loginButtonStyles,
  footerTextStyles,
} from './LoginForm.styles';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (formData.username && formData.password) {
      // Mock login: set a token
      localStorage.setItem('auth_token', 'mock_token');
      navigate('/dashboard');
    }
  };

  const handleTogglePassword = () => setShowPassword(!showPassword);

  return (
    <Box sx={loginFormContainerStyles}>
      <Box sx={loginFormBoxStyles}>
        <Box sx={headerBoxStyles}>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please enter your credentials to log in.
          </Typography>
        </Box>

        <Box component="form" noValidate onSubmit={handleSubmit} sx={formContainerStyles}>
          <Box sx={{ mb: 3 }}>
            <TextField
              required
              fullWidth
              id="email"
              label="Username or Email"
              placeholder="Enter your username or email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={textFieldStyles}
            />
          </Box>

          <Box sx={{ mb: 1 }}>
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              placeholder="Enter your password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={handleTogglePassword} 
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={textFieldStyles}
            />
          </Box>

          <Box sx={actionRowStyles}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Remember me
                </Typography>
              }
            />
            <Link
              href="#"
              variant="body2"
              sx={{
                fontWeight: 600,
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Forgot Password?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={loginButtonStyles}
          >
            Log In
          </Button>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={footerTextStyles}
          >
            &copy; {new Date().getFullYear()} Howrah Milk Union Ltd. All Rights Reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginForm;
