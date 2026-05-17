import React from "react";
import { Box, Typography, Grid, IconButton, Tooltip } from "@mui/material";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { HmuButton, HmuTextField, HmuDataField } from "../../../../../shared/components";
import {
  formContainerStyles,
  sectionHeaderStyles,
  sectionLabelStyles,
  actionContainerStyles,
  cancelButtonStyles,
  submitButtonStyles,
} from "./UnitForm.styles";
import { useNotificationStore } from "../../../../../shared/store/useNotificationStore";

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
  const { showNotification } = useNotificationStore();

  const {
    register,
    handleSubmit,
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
    },
  });

  const handleFormSubmit: SubmitHandler<UnitFormData> = (data, event) => {
    onSubmit(data, event);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showNotification("Unit Code copied to clipboard", "success");
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
              {isViewMode ? (
                <HmuDataField label="Unit Name" value={defaultValues?.name} />
              ) : (
                <HmuTextField
                  id="unit-name"
                  label="Unit Name"
                  placeholder="e.g. Central Chilling Plant"
                  required
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isLoading}
                  {...register("name")}
                />
              )}
            </Grid>

            <Grid size={12}>
              {isViewMode ? (
                <HmuDataField 
                  label="Unit Code" 
                  value={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                        {defaultValues?.code}
                      </Typography>
                      <Tooltip title="Copy Code">
                        <IconButton size="small" onClick={() => handleCopyCode(defaultValues?.code || '')}>
                          <ContentCopyIcon fontSize="small" sx={{ opacity: 0.6 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  } 
                />
              ) : (
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
                  disabled={isLoading || isEditMode}
                  {...register("code")}
                />
              )}
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
              {isViewMode ? (
                <HmuDataField label="Address Line 1" value={defaultValues?.address?.addressLine1} />
              ) : (
                <HmuTextField
                  id="address-line-1"
                  label="Address Line 1"
                  placeholder="Street address, P.O. box, company name"
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
                <HmuDataField label="Address Line 2" value={defaultValues?.address?.addressLine2} />
              ) : (
                <HmuTextField
                  id="address-line-2"
                  label="Address Line 2"
                  placeholder="Apartment, suite, unit, building, floor, etc. (Optional)"
                  error={!!errors.address?.addressLine2}
                  helperText={errors.address?.addressLine2?.message}
                  disabled={isLoading}
                  {...register("address.addressLine2")}
                />
              )}
            </Grid>

            <Grid size={6}>
              {isViewMode ? (
                <HmuDataField label="City" value={defaultValues?.address?.city} />
              ) : (
                <HmuTextField
                  id="city"
                  label="City"
                  placeholder="City (Optional)"
                  error={!!errors.address?.city}
                  helperText={errors.address?.city?.message}
                  disabled={isLoading}
                  {...register("address.city")}
                />
              )}
            </Grid>

            <Grid size={6}>
              {isViewMode ? (
                <HmuDataField label="District" value={defaultValues?.address?.district} />
              ) : (
                <HmuTextField
                  id="district"
                  label="District"
                  placeholder="District (Optional)"
                  error={!!errors.address?.district}
                  helperText={errors.address?.district?.message}
                  disabled={isLoading}
                  {...register("address.district")}
                />
              )}
            </Grid>

            <Grid size={6}>
              {isViewMode ? (
                <HmuDataField label="State" value={defaultValues?.address?.state} />
              ) : (
                <HmuTextField
                  id="state"
                  label="State"
                  placeholder="State (Optional)"
                  error={!!errors.address?.state}
                  helperText={errors.address?.state?.message}
                  disabled={isLoading}
                  {...register("address.state")}
                />
              )}
            </Grid>

            <Grid size={6}>
              {isViewMode ? (
                <HmuDataField label="Postal Code" value={defaultValues?.address?.postalCode} />
              ) : (
                <HmuTextField
                  id="postal-code"
                  label="Postal Code"
                  placeholder="Postal Code (Optional)"
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
