import React from "react";
import { Box, Switch, FormControlLabel, Typography, Grid } from "@mui/material";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HmuButton, HmuTextField } from "../../../../../shared/components";
import {
  formContainerStyles,
  sectionHeaderStyles,
  sectionLabelStyles,
  statusBoxStyles,
  formLabelControlStyles,
  statusTitleStyles,
  statusSubtitleStyles,
  actionContainerStyles,
  cancelButtonStyles,
  submitButtonStyles,
} from "./UnitForm.styles";

const addressSchema = z.object({
  addressLine1: z.string().min(1, "Address Line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
});

const unitSchema = z.object({
  name: z.string().min(1, "Unit Name is required"),
  code: z.string().min(1, "Unit Code is required"),
  address: addressSchema,
  active: z.boolean(),
});

export type UnitFormData = z.infer<typeof unitSchema>;

interface UnitFormProps {
  mode: "create" | "edit" | "view";
  onSubmit: (data: UnitFormData, event?: React.BaseSyntheticEvent) => void;
  onCancel: () => void;
  isLoading?: boolean;
  defaultValues?: Partial<UnitFormData>;
}

const UnitForm: React.FC<UnitFormProps> = ({
  mode,
  onSubmit,
  onCancel,
  isLoading = false,
  defaultValues,
}) => {
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      code: defaultValues?.code || "",
      address: {
        addressLine1: defaultValues?.address?.addressLine1 || "",
        addressLine2: defaultValues?.address?.addressLine2 || "",
        city: defaultValues?.address?.city || "",
        district: defaultValues?.address?.district || "",
        state: defaultValues?.address?.state || "",
        postalCode: defaultValues?.address?.postalCode || "",
      },
      active: defaultValues?.active ?? true,
    },
  });

  const handleFormSubmit: SubmitHandler<UnitFormData> = (data, event) => {
    onSubmit(data, event);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Box sx={formContainerStyles}>
        {/* Unit Information Group */}
        <Box>
          <Box sx={sectionHeaderStyles}>
            <Typography sx={sectionLabelStyles}>Unit Information</Typography>
          </Box>
          <Grid container spacing={2.5}>
            <Grid size={12}>
              <HmuTextField
                id="unit-name"
                label="Unit Name"
                placeholder="e.g. Central Chilling Plant"
                required
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={isLoading || isViewMode}
                {...register("name")}
              />
            </Grid>

            <Grid size={12}>
              <HmuTextField
                id="unit-code"
                label="Unit Code"
                placeholder="e.g. CCP-001"
                required
                error={!!errors.code}
                helperText={
                  errors.code?.message ||
                  (mode === "create"
                    ? "Warning: Unit Code cannot be modified once created."
                    : "")
                }
                disabled={isLoading || isViewMode || isEditMode}
                {...register("code")}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Address Details Group */}
        <Box>
          <Box sx={sectionHeaderStyles}>
            <Typography sx={sectionLabelStyles}>Address Details</Typography>
          </Box>
          <Grid container spacing={2.5}>
            <Grid size={12}>
              <HmuTextField
                id="address-line-1"
                label="Address Line 1"
                placeholder="Street address, P.O. box, company name"
                required
                error={!!errors.address?.addressLine1}
                helperText={errors.address?.addressLine1?.message}
                disabled={isLoading || isViewMode}
                {...register("address.addressLine1")}
              />
            </Grid>

            <Grid size={12}>
              <HmuTextField
                id="address-line-2"
                label="Address Line 2"
                placeholder="Apartment, suite, unit, building, floor, etc. (Optional)"
                error={!!errors.address?.addressLine2}
                helperText={errors.address?.addressLine2?.message}
                disabled={isLoading || isViewMode}
                {...register("address.addressLine2")}
              />
            </Grid>

            <Grid size={6}>
              <HmuTextField
                id="city"
                label="City"
                placeholder="City (Optional)"
                error={!!errors.address?.city}
                helperText={errors.address?.city?.message}
                disabled={isLoading || isViewMode}
                {...register("address.city")}
              />
            </Grid>

            <Grid size={6}>
              <HmuTextField
                id="district"
                label="District"
                placeholder="District (Optional)"
                error={!!errors.address?.district}
                helperText={errors.address?.district?.message}
                disabled={isLoading || isViewMode}
                {...register("address.district")}
              />
            </Grid>

            <Grid size={6}>
              <HmuTextField
                id="state"
                label="State"
                placeholder="State (Optional)"
                error={!!errors.address?.state}
                helperText={errors.address?.state?.message}
                disabled={isLoading || isViewMode}
                {...register("address.state")}
              />
            </Grid>

            <Grid size={6}>
              <HmuTextField
                id="postal-code"
                label="Postal Code"
                placeholder="Postal Code (Optional)"
                error={!!errors.address?.postalCode}
                helperText={errors.address?.postalCode?.message}
                disabled={isLoading || isViewMode}
                {...register("address.postalCode")}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Footer Settings */}
        <Box sx={statusBoxStyles}>
          <Controller
            name="active"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                sx={formLabelControlStyles}
                control={
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                    color="primary"
                    disabled={isLoading || isViewMode}
                  />
                }
                label={
                  <Box>
                    <Typography sx={statusTitleStyles}>
                      Active Status
                    </Typography>
                    <Typography sx={statusSubtitleStyles}>
                      Unit will be visible and operational across the system
                    </Typography>
                  </Box>
                }
              />
            )}
          />
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
            label={isEditMode ? "Save Changes" : "Create Unit"}
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

export default UnitForm;
