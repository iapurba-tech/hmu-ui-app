import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Link,
  Checkbox,
  FormControlLabel,
  Alert,
} from "@mui/material";
import {
  LockIcon,
  UserIcon,
  VisibilityOutlinedIcon as VisibilityIcon,
  VisibilityOffOutlinedIcon as VisibilityOffIcon,
} from "../../../../shared/icons";
import { Navigate, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../../../shared/api/auth/auth.hooks";
import { HmuButton, HmuTextField } from "../../../../shared/components";
import {
  loginFormContainerStyles,
  headerBoxStyles,
  loginFormBoxStyles,
  formContainerStyles,
  actionRowStyles,
  footerTextStyles,
} from "./LoginForm.styles";
import { useAuthStore } from "../../../../shared/store/useAuthStore";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, "Username or Email is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { mutate: login, isPending, isError, error } = useLoginMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
      rememberMe: false,
    },
  });

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = (data: LoginFormData) => {
    const { usernameOrEmail, password } = data;
    login(
      { usernameOrEmail, password },
      {
        onSuccess: () => {
          navigate("/dashboard");
        },
      },
    );
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
          onSubmit={handleSubmit(onSubmit)}
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
            <HmuTextField
              required
              fullWidth
              id="username"
              label="Username or Email"
              placeholder="Enter your username or email"
              autoComplete="username"
              autoFocus
              disabled={isPending}
              error={!!errors.usernameOrEmail}
              helperText={errors.usernameOrEmail?.message}
              startIcon={<UserIcon />}
              {...register("usernameOrEmail")}
            />
          </Box>

          <Box sx={{ mb: 1 }}>
            <HmuTextField
              required
              fullWidth
              label="Password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              disabled={isPending}
              error={!!errors.password}
              helperText={errors.password?.message}
              startIcon={<LockIcon />}
              endIcon={
                <IconButton
                  onClick={handleTogglePassword}
                  edge="end"
                  aria-label="toggle password visibility"
                  disabled={isPending}
                  size="small"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              }
              {...register("password")}
            />
          </Box>

          <Box sx={actionRowStyles}>
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
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
              )}
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
