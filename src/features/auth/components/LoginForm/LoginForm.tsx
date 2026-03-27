import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Link,
  Checkbox,
  FormControlLabel,
  Alert,
} from "@mui/material";
import {
  PersonRounded as Person,
  LockRounded as Lock,
  VisibilityRounded as Visibility,
  VisibilityOffRounded as VisibilityOff,
} from "@mui/icons-material";
import { Navigate, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../../../shared/api/auth/auth.hooks";
import { HmuButton } from "../../../../shared/components";
import {
  loginFormContainerStyles,
  headerBoxStyles,
  loginFormBoxStyles,
  formContainerStyles,
  textFieldStyles,
  actionRowStyles,
  footerTextStyles,
} from "./LoginForm.styles";
import { useAuthStore } from "../../../../shared/store/useAuthStore";

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { mutate: login, isPending, isError, error } = useLoginMutation();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (formData.username && formData.password) {
      login(formData, {
        onSuccess: () => {
          navigate("/dashboard");
        },
      });
    }
  };

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const hmuCopyRights = (
    <Typography variant="caption" color="text.secondary" sx={footerTextStyles}>
      &copy; {new Date().getFullYear()} Howrah Milk Union Ltd. All Rights
      Reserved.
    </Typography>
  );

  return (
    <Box sx={loginFormContainerStyles}>
      <Box sx={loginFormBoxStyles}>
        <Box sx={headerBoxStyles}>
          <Typography
            component="h1"
            variant="h4"
            sx={{ fontWeight: 700, mb: 1 }}
          >
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please enter your credentials to log in.
          </Typography>
        </Box>

        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={formContainerStyles}
        >
          {isError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error instanceof Error
                ? error.message
                : "Login failed. Please try again."}
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <TextField
              required
              fullWidth
              id="username"
              label="Username or Email"
              placeholder="Enter your username or email"
              name="username"
              autoComplete="username"
              autoFocus
              disabled={isPending}
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
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
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              disabled={isPending}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
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
                        disabled={isPending}
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
                  disabled={isPending}
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
                color: "primary.main",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Forgot Password?
            </Link>
          </Box>

          <HmuButton
            label="Log In"
            type="submit"
            fullWidth
            variant="primary"
            loading={isPending}
            aria-label="Log In"
          />

          {hmuCopyRights}
        </Box>
      </Box>
    </Box>
  );
};

export default LoginForm;
