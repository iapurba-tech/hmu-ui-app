import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  Chip,
  alpha,
} from "@mui/material";
import {
  useForm,
  type SubmitHandler,
  Controller,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  HmuButton,
  HmuTextField,
  HmuDataField,
  HmuSelect,
  type HmuSelectOption,
} from "../../../../../shared/components";
import {
  formContainerStyles,
  sectionHeaderStyles,
  sectionLabelStyles,
  actionContainerStyles,
  cancelButtonStyles,
  submitButtonStyles,
} from "./UserForm.styles";
import { UserRole } from "../../../../auth/constants/roles";
import { useGetUnits } from "../../../../../shared/api/admin/admin.hooks";
import { useNotificationStore } from "../../../../../shared/store/useNotificationStore";
import { userSchema, type UserFormData } from "../../types/user.schema";

export type { UserFormData };

interface UserFormProps {
  mode: "create" | "edit" | "view";
  onSubmit: (data: UserFormData, event?: React.BaseSyntheticEvent) => void;
  onCancel: () => void;
  isLoading?: boolean;
  defaultValues?: Partial<UserFormData>;
}

const UserForm: React.FC<UserFormProps> = ({
  mode,
  onSubmit,
  onCancel,
  isLoading = false,
  defaultValues,
}) => {
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const { showNotification } = useNotificationStore();

  const { data: units = [] } = useGetUnits();

  const roleOptions: HmuSelectOption[] = useMemo(
    () =>
      Object.values(UserRole).map((role) => ({
        label: role.replace("ROLE_", "").replace("_", " "),
        value: role,
      })),
    [],
  );

  const unitOptions: HmuSelectOption[] = useMemo(
    () =>
      units.map((unit) => ({
        label: unit.name,
        value: unit.id,
        secondaryLabel: unit.code,
      })),
    [units],
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstname: defaultValues?.firstname || "",
      lastname: defaultValues?.lastname || "",
      username: defaultValues?.username || "",
      password: "",
      email: defaultValues?.email || "",
      role: defaultValues?.role || UserRole.UNIT_ADMIN,
      unitIds: defaultValues?.unitIds || [],
      mpcsId: defaultValues?.mpcsId || null,
      address: {
        addressLine1: defaultValues?.address?.addressLine1 || "",
        addressLine2: defaultValues?.address?.addressLine2 || "",
        city: defaultValues?.address?.city || "",
        district: defaultValues?.address?.district || "",
        state: defaultValues?.address?.state || "",
        postalCode: defaultValues?.address?.postalCode || "",
      },
    },
  });

  const selectedRole = useWatch({ control, name: "role" });
  const isSystemAdmin = selectedRole === UserRole.SYSTEM_ADMIN;

  const handleFormSubmit: SubmitHandler<UserFormData> = (data, event) => {
    const submissionData = { ...data };
    if (isSystemAdmin) {
      submissionData.unitIds = [];
    }
    if (mode === "edit" && !submissionData.password) {
      delete submissionData.password;
    }
    onSubmit(submissionData, event);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showNotification(`${label} copied to clipboard`, "success");
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Box sx={formContainerStyles}>
        {/* Personal Information Group */}
        <Box>
          <Box sx={sectionHeaderStyles}>
            <Typography sx={sectionLabelStyles}>
              Personal Information
            </Typography>
          </Box>
          <Grid container spacing={2.5}>
            <Grid size={6}>
              {isViewMode ? (
                <HmuDataField
                  label="First Name"
                  value={defaultValues?.firstname}
                />
              ) : (
                <HmuTextField
                  id="firstname"
                  label="First Name"
                  placeholder="John"
                  required
                  error={!!errors.firstname}
                  helperText={errors.firstname?.message}
                  disabled={isLoading}
                  {...register("firstname")}
                />
              )}
            </Grid>
            <Grid size={6}>
              {isViewMode ? (
                <HmuDataField
                  label="Last Name"
                  value={defaultValues?.lastname}
                />
              ) : (
                <HmuTextField
                  id="lastname"
                  label="Last Name"
                  placeholder="Doe"
                  required
                  error={!!errors.lastname}
                  helperText={errors.lastname?.message}
                  disabled={isLoading}
                  {...register("lastname")}
                />
              )}
            </Grid>
            <Grid size={12}>
              {isViewMode ? (
                <HmuDataField
                  label="Email Address"
                  value={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Typography variant="body2">
                        {defaultValues?.email}
                      </Typography>
                      <Tooltip title="Copy Email">
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleCopy(defaultValues?.email || "", "Email")
                          }
                        >
                          <ContentCopyIcon
                            fontSize="small"
                            sx={{ opacity: 0.6 }}
                          />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                />
              ) : (
                <HmuTextField
                  id="email"
                  label="Email Address"
                  placeholder="john.doe@example.com"
                  required
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isLoading}
                  {...register("email")}
                />
              )}
            </Grid>
          </Grid>
        </Box>

        {/* Account Settings Group */}
        <Box>
          <Box sx={sectionHeaderStyles}>
            <Typography sx={sectionLabelStyles}>Account Settings</Typography>
          </Box>
          <Grid container spacing={2.5}>
            <Grid size={6}>
              {isViewMode ? (
                <HmuDataField
                  label="Username"
                  value={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {defaultValues?.username}
                      </Typography>
                      <Tooltip title="Copy Username">
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleCopy(
                              defaultValues?.username || "",
                              "Username",
                            )
                          }
                        >
                          <ContentCopyIcon
                            fontSize="small"
                            sx={{ opacity: 0.6 }}
                          />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                />
              ) : (
                <HmuTextField
                  id="username"
                  label="Username"
                  placeholder="johndoe123"
                  required
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  disabled={isLoading || isEditMode}
                  {...register("username")}
                />
              )}
            </Grid>
            <Grid size={6}>
              {isViewMode ? (
                <HmuDataField label="Password" value="••••••••" />
              ) : (
                <HmuTextField
                  id="password"
                  label={isEditMode ? "New Password (Optional)" : "Password"}
                  type="password"
                  placeholder="••••••••"
                  required={mode === "create"}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={isLoading}
                  {...register("password")}
                />
              )}
            </Grid>
            <Grid size={isSystemAdmin ? 12 : 6}>
              {isViewMode ? (
                <HmuDataField
                  label="Role"
                  value={defaultValues?.role
                    ?.replace("ROLE_", "")
                    .replace("_", " ")}
                />
              ) : (
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <HmuSelect
                      {...field}
                      id="role-select"
                      label="Role"
                      required
                      options={roleOptions}
                      error={!!errors.role}
                      helperText={errors.role?.message}
                      disabled={isLoading}
                    />
                  )}
                />
              )}
            </Grid>
            {!isSystemAdmin && (
              <Grid size={6}>
                {isViewMode ? (
                  <HmuDataField
                    label="Assigned Units"
                    value={
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                          mt: 0.5,
                        }}
                      >
                        {(defaultValues?.unitIds?.length || 0) > 0 ? (
                          defaultValues?.unitIds?.map((id) => {
                            const unit = units.find((u) => u.id === id);
                            return unit ? (
                              <Chip
                                key={id}
                                label={unit.name}
                                size="small"
                                variant="outlined"
                                sx={{
                                  height: 24,
                                  fontSize: "0.75rem",
                                  borderColor: (theme) =>
                                    alpha(theme.palette.primary.main, 0.2),
                                  bgcolor: (theme) =>
                                    alpha(theme.palette.primary.main, 0.04),
                                  fontWeight: 500,
                                }}
                              />
                            ) : null;
                          })
                        ) : (
                          <Typography variant="body2" color="text.disabled">
                            None
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                ) : (
                  <Controller
                    name="unitIds"
                    control={control}
                    render={({ field }) => (
                      <HmuSelect
                        {...field}
                        id="units-select"
                        label="Assigned Units"
                        multiple
                        options={unitOptions}
                        error={!!errors.unitIds}
                        helperText={errors.unitIds?.message}
                        disabled={isLoading}
                        renderChips
                      />
                    )}
                  />
                )}
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Address Details Group */}
        <Box>
          <Box sx={sectionHeaderStyles}>
            <Typography sx={sectionLabelStyles}>Address Details</Typography>
          </Box>
          <Grid container spacing={2.5}>
            <Grid size={12}>
              {isViewMode ? (
                <HmuDataField
                  label="Address Line 1"
                  value={defaultValues?.address?.addressLine1}
                />
              ) : (
                <HmuTextField
                  id="address-line-1"
                  label="Address Line 1"
                  placeholder="Street address, P.O. box"
                  required
                  error={!!errors.address?.addressLine1}
                  helperText={errors.address?.addressLine1?.message}
                  disabled={isLoading}
                  {...register("address.addressLine1")}
                />
              )}
            </Grid>
            <Grid size={12}>
              {isViewMode ? (
                <HmuDataField
                  label="Address Line 2"
                  value={defaultValues?.address?.addressLine2}
                />
              ) : (
                <HmuTextField
                  id="address-line-2"
                  label="Address Line 2"
                  placeholder="Apartment, suite, unit, etc. (Optional)"
                  error={!!errors.address?.addressLine2}
                  helperText={errors.address?.addressLine2?.message}
                  disabled={isLoading}
                  {...register("address.addressLine2")}
                />
              )}
            </Grid>
            <Grid size={6}>
              {isViewMode ? (
                <HmuDataField
                  label="City"
                  value={defaultValues?.address?.city}
                />
              ) : (
                <HmuTextField
                  id="city"
                  label="City"
                  placeholder="City"
                  required
                  error={!!errors.address?.city}
                  helperText={errors.address?.city?.message}
                  disabled={isLoading}
                  {...register("address.city")}
                />
              )}
            </Grid>
            <Grid size={6}>
              {isViewMode ? (
                <HmuDataField
                  label="District"
                  value={defaultValues?.address?.district}
                />
              ) : (
                <HmuTextField
                  id="district"
                  label="District"
                  placeholder="District"
                  required
                  error={!!errors.address?.district}
                  helperText={errors.address?.district?.message}
                  disabled={isLoading}
                  {...register("address.district")}
                />
              )}
            </Grid>
            <Grid size={6}>
              {isViewMode ? (
                <HmuDataField
                  label="State"
                  value={defaultValues?.address?.state}
                />
              ) : (
                <HmuTextField
                  id="state"
                  label="State"
                  placeholder="State"
                  required
                  error={!!errors.address?.state}
                  helperText={errors.address?.state?.message}
                  disabled={isLoading}
                  {...register("address.state")}
                />
              )}
            </Grid>
            <Grid size={6}>
              {isViewMode ? (
                <HmuDataField
                  label="Postal Code"
                  value={defaultValues?.address?.postalCode}
                />
              ) : (
                <HmuTextField
                  id="postal-code"
                  label="Postal Code"
                  placeholder="Postal Code"
                  required
                  error={!!errors.address?.postalCode}
                  helperText={errors.address?.postalCode?.message}
                  disabled={isLoading}
                  {...register("address.postalCode")}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Box sx={actionContainerStyles}>
        <HmuButton
          label={isViewMode ? "Close" : "Cancel"}
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
          sx={cancelButtonStyles}
        />
        {!isViewMode && (
          <HmuButton
            label={isEditMode ? "Save Changes" : "Create User"}
            type="submit"
            variant="primary"
            loading={isLoading}
            sx={submitButtonStyles}
          />
        )}
      </Box>
    </Box>
  );
};

export default UserForm;
