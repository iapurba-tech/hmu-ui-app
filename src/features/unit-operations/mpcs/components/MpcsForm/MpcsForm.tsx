import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  FormControlLabel,
  Checkbox,
  alpha,
} from "@mui/material";
import {
  useForm,
  Controller,
  type SubmitHandler,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import {
  HmuButton,
  HmuTextField,
  HmuDataField,
  HmuSelect,
  HmuDatePicker,
  HmuSwitch,
} from "../../../../../shared/components";
import {
  formContainerStyles,
  sectionHeaderStyles,
  sectionLabelStyles,
  actionContainerStyles,
  configItemStyles,
} from "./MpcsForm.styles";
import { mpcsFormSchema } from "../../types/mpcs.schema";
import type { Mpcs, MpcsFormValues } from "../../types/mpcs.types";
import { useGetUnits } from "../../../../../shared/api/admin/unit/unit.hooks";
import { useGetBankAccounts } from "../../../../../shared/api/admin/bank/bank.hooks";
import { useGetHeadLoadCategories } from "../../../../../shared/api/pricing/head-load/head-load-category.hooks";
import { useAuthStore } from "../../../../../shared/store/useAuthStore";

interface MpcsFormProps {
  mode: "create" | "edit" | "view";
  onSubmit: (data: MpcsFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
  defaultValues?: Partial<Mpcs>;
}

const MpcsForm: React.FC<MpcsFormProps> = ({
  mode,
  onSubmit,
  onCancel,
  isLoading = false,
  defaultValues,
}) => {
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";

  const { activeUnit } = useAuthStore();
  const { data: units = [] } = useGetUnits();
  const { data: payoutBanks = [] } = useGetBankAccounts(activeUnit?.id);
  const { data: headLoadCategories = [] } = useGetHeadLoadCategories();

  const unitOptions = useMemo(
    () => units.map((u) => ({ label: u.name, value: u.id })),
    [units],
  );

  const payoutBankOptions = useMemo(
    () =>
      payoutBanks.map((b) => ({
        label: `${b.bankName} (${b.accountNumber})`,
        value: b.id,
      })),
    [payoutBanks],
  );

  const headLoadOptions = useMemo(
    () =>
      headLoadCategories.map((c) => ({
        label: `${c.description} (${c.code})`,
        value: c.id,
      })),
    [headLoadCategories],
  );

  const formDefaultValues = useMemo<MpcsFormValues>(() => {
    const hasAddressData = !!(
      defaultValues?.address?.addressLine1 ||
      defaultValues?.address?.city ||
      defaultValues?.address?.postalCode
    );

    return {
      name: defaultValues?.name || "",
      contactPerson: defaultValues?.contactPerson || "",
      contactNumber: defaultValues?.contactNumber || "",
      contactEmail: defaultValues?.contactEmail || "",
      bankAccountNumber: defaultValues?.bankAccountNumber || "",
      bankIfsc: defaultValues?.bankIfsc || "",
      bankName: defaultValues?.bankName || "",
      registrationDate: defaultValues?.registrationDate || "",
      closureDate: defaultValues?.closureDate || null,
      unitId: defaultValues?.unitId || activeUnit?.id || "",
      payoutBankId:
        defaultValues?.payoutBankId ||
        (defaultValues as any)?.payoutBank?.id ||
        "",
      headLoadCategoryId:
        defaultValues?.headLoadCategoryId ||
        (headLoadCategories.length > 0 ? headLoadCategories[0].id : 0),
      active: defaultValues?.active ?? true,
      paymentPaused: defaultValues?.paymentPaused ?? false,
      subsidyAllowed: defaultValues?.subsidyAllowed ?? false,
      headLoadAllowed: defaultValues?.headLoadAllowed ?? false,
      incentiveAllowed: defaultValues?.incentiveAllowed ?? false,
      commissionAllowed: defaultValues?.commissionAllowed ?? false,
      skipAddress: mode === "create" ? false : !hasAddressData,
      address: {
        addressLine1: defaultValues?.address?.addressLine1 || null,
        addressLine2: defaultValues?.address?.addressLine2 || null,
        city: defaultValues?.address?.city || null,
        district: defaultValues?.address?.district || null,
        state: defaultValues?.address?.state || null,
        postalCode: defaultValues?.address?.postalCode || null,
      },
    };
  }, [defaultValues, mode, headLoadCategories, activeUnit]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<MpcsFormValues>({
    resolver: zodResolver(mpcsFormSchema),
    values: formDefaultValues,
  });

  const skipAddress = useWatch({ control, name: "skipAddress" });
  const hasAddress = skipAddress === false;
  const addressErrors: any = errors.address || {};

  const handleFormSubmit: SubmitHandler<MpcsFormValues> = (data) => {
    const submissionData = { ...data };
    if (skipAddress) {
      submissionData.address = null;
    }
    onSubmit(submissionData);
  };

  const handleAddressChoice = (skip: boolean) => {
    setValue("skipAddress", skip);
    if (skip) {
      clearErrors("address");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Box sx={formContainerStyles}>
        {/* Basic Information */}
        <Box>
          <Box sx={sectionHeaderStyles}>
            <Typography sx={sectionLabelStyles}>Basic Information</Typography>
          </Box>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              {isViewMode ? (
                <HmuDataField label="MPCS Name" value={defaultValues?.name} />
              ) : (
                <HmuTextField
                  label="MPCS Name"
                  required
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  {...register("name")}
                />
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {isViewMode ? (
                <HmuDataField
                  label="Contact Person"
                  value={defaultValues?.contactPerson}
                />
              ) : (
                <HmuTextField
                  label="Contact Person"
                  required
                  error={!!errors.contactPerson}
                  helperText={errors.contactPerson?.message}
                  {...register("contactPerson")}
                />
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {isViewMode ? (
                <HmuDataField
                  label="Contact Number"
                  value={defaultValues?.contactNumber}
                />
              ) : (
                <HmuTextField
                  label="Contact Number"
                  required
                  error={!!errors.contactNumber}
                  helperText={errors.contactNumber?.message}
                  placeholder="10 digit number"
                  {...register("contactNumber")}
                />
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {isViewMode ? (
                <HmuDataField
                  label="Contact Email"
                  value={defaultValues?.contactEmail || "N/A"}
                />
              ) : (
                <HmuTextField
                  label="Contact Email"
                  error={!!errors.contactEmail}
                  helperText={errors.contactEmail?.message}
                  {...register("contactEmail")}
                />
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {isViewMode ? (
                <HmuDataField
                  label="Registration Date"
                  value={defaultValues?.registrationDate}
                />
              ) : (
                <Controller
                  name="registrationDate"
                  control={control}
                  render={({ field }) => (
                    <HmuDatePicker
                      {...field}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date: any) =>
                        field.onChange(
                          date ? dayjs(date).format("YYYY-MM-DD") : "",
                        )
                      }
                      label="Registration Date"
                      required
                      error={!!errors.registrationDate}
                      helperText={errors.registrationDate?.message}
                    />
                  )}
                />
              )}
            </Grid>
            {(isEditMode || isViewMode) && (
              <Grid size={{ xs: 12, sm: 6 }}>
                {isViewMode ? (
                  <HmuDataField
                    label="Closure Date"
                    value={defaultValues?.closureDate || "N/A"}
                  />
                ) : (
                  <Controller
                    name="closureDate"
                    control={control}
                    render={({ field }) => (
                      <HmuDatePicker
                        {...field}
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date: any) =>
                          field.onChange(
                            date ? dayjs(date).format("YYYY-MM-DD") : null,
                          )
                        }
                        label="Closure Date"
                        error={!!errors.closureDate}
                        helperText={errors.closureDate?.message}
                      />
                    )}
                  />
                )}
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Bank Details */}
        <Box>
          <Box sx={sectionHeaderStyles}>
            <Typography sx={sectionLabelStyles}>Bank Details</Typography>
          </Box>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              {isViewMode ? (
                <HmuDataField
                  label="Bank Account Number"
                  value={defaultValues?.bankAccountNumber}
                />
              ) : (
                <HmuTextField
                  label="Bank Account Number"
                  required
                  error={!!errors.bankAccountNumber}
                  helperText={errors.bankAccountNumber?.message}
                  placeholder="10-20 digit number"
                  {...register("bankAccountNumber")}
                />
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {isViewMode ? (
                <HmuDataField
                  label="Bank IFSC"
                  value={defaultValues?.bankIfsc || "N/A"}
                />
              ) : (
                <HmuTextField
                  label="Bank IFSC"
                  error={!!errors.bankIfsc}
                  helperText={errors.bankIfsc?.message}
                  {...register("bankIfsc")}
                />
              )}
            </Grid>
            <Grid size={12}>
              {isViewMode ? (
                <HmuDataField
                  label="Bank Name"
                  value={defaultValues?.bankName || "N/A"}
                />
              ) : (
                <HmuTextField
                  label="Bank Name"
                  error={!!errors.bankName}
                  helperText={errors.bankName?.message}
                  {...register("bankName")}
                />
              )}
            </Grid>
          </Grid>
        </Box>

        {/* Address Details */}
        <Box>
          <Box sx={sectionHeaderStyles}>
            <Typography sx={sectionLabelStyles}>Address Details</Typography>
          </Box>

          {!isViewMode && (
            <Box
              sx={{
                p: 2,
                mb: 2,
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: "8px",
                bgcolor: (theme) =>
                  alpha(theme.palette.action.disabledBackground, 0.03),
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Address information is optional. Select "Skip Address
                Information" if you don't wish to provide an address.
              </Typography>
            </Box>
          )}

          {!isViewMode && (
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={!hasAddress}
                    onChange={(e) => handleAddressChoice(e.target.checked)}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Skip Address Information
                  </Typography>
                }
                disabled={isLoading}
              />
            </Box>
          )}

          {(hasAddress || isViewMode) && (
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                {isViewMode ? (
                  <HmuDataField
                    label="Address Line 1"
                    value={defaultValues?.address?.addressLine1}
                  />
                ) : (
                  <HmuTextField
                    label="Address Line 1"
                    required={hasAddress}
                    error={!!addressErrors.addressLine1}
                    helperText={addressErrors.addressLine1?.message}
                    {...register("address.addressLine1")}
                  />
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                {isViewMode ? (
                  <HmuDataField
                    label="Address Line 2"
                    value={defaultValues?.address?.addressLine2 || "N/A"}
                  />
                ) : (
                  <HmuTextField
                    label="Address Line 2"
                    {...register("address.addressLine2")}
                  />
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                {isViewMode ? (
                  <HmuDataField
                    label="City"
                    value={defaultValues?.address?.city}
                  />
                ) : (
                  <HmuTextField
                    label="City"
                    required={hasAddress}
                    error={!!addressErrors.city}
                    helperText={addressErrors.city?.message}
                    {...register("address.city")}
                  />
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                {isViewMode ? (
                  <HmuDataField
                    label="District"
                    value={defaultValues?.address?.district}
                  />
                ) : (
                  <HmuTextField
                    label="District"
                    required={hasAddress}
                    error={!!addressErrors.district}
                    helperText={addressErrors.district?.message}
                    {...register("address.district")}
                  />
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                {isViewMode ? (
                  <HmuDataField
                    label="State"
                    value={defaultValues?.address?.state}
                  />
                ) : (
                  <HmuTextField
                    label="State"
                    required={hasAddress}
                    error={!!addressErrors.state}
                    helperText={addressErrors.state?.message}
                    {...register("address.state")}
                  />
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                {isViewMode ? (
                  <HmuDataField
                    label="Postal Code"
                    value={defaultValues?.address?.postalCode}
                  />
                ) : (
                  <HmuTextField
                    label="Postal Code"
                    required={hasAddress}
                    error={!!addressErrors.postalCode}
                    helperText={addressErrors.postalCode?.message}
                    {...register("address.postalCode")}
                  />
                )}
              </Grid>
            </Grid>
          )}
        </Box>

        {/* Operations */}
        <Box>
          <Box sx={sectionHeaderStyles}>
            <Typography sx={sectionLabelStyles}>Operations</Typography>
          </Box>
          <Grid container spacing={2.5}>
            {!isCreateMode && (
              <Grid size={{ xs: 12, sm: 6 }}>
                {isViewMode ? (
                  <HmuDataField
                    label="Unit"
                    value={
                      units.find((u) => u.id === defaultValues?.unitId)?.name ||
                      "N/A"
                    }
                  />
                ) : (
                  <Controller
                    name="unitId"
                    control={control}
                    render={({ field }) => (
                      <HmuSelect
                        {...field}
                        label="Unit"
                        required
                        options={unitOptions}
                        error={!!errors.unitId}
                        helperText={errors.unitId?.message}
                        disabled={isEditMode}
                      />
                    )}
                  />
                )}
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: 6 }}>
              {isViewMode ? (
                <HmuDataField
                  label="Payout Bank"
                  value={
                    payoutBanks.find(
                      (b) =>
                        b.id ===
                        (defaultValues?.payoutBankId ||
                          (defaultValues as any)?.payoutBank?.id),
                    )?.bankName || "N/A"
                  }
                />
              ) : (
                <Controller
                  name="payoutBankId"
                  control={control}
                  render={({ field }) => (
                    <HmuSelect
                      {...field}
                      label="Payout Bank"
                      required
                      options={payoutBankOptions}
                      error={!!errors.payoutBankId}
                      helperText={errors.payoutBankId?.message}
                    />
                  )}
                />
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {isViewMode ? (
                <HmuDataField
                  label="Head Load Category"
                  value={
                    headLoadCategories.find(
                      (c) => c.id === defaultValues?.headLoadCategoryId,
                    )?.description || "N/A"
                  }
                />
              ) : (
                <Controller
                  name="headLoadCategoryId"
                  control={control}
                  render={({ field }) => (
                    <HmuSelect
                      {...field}
                      label="Head Load Category"
                      required
                      options={headLoadOptions}
                      error={!!errors.headLoadCategoryId}
                      helperText={errors.headLoadCategoryId?.message}
                    />
                  )}
                />
              )}
            </Grid>
          </Grid>
        </Box>

        {/* Configuration */}
        <Box>
          <Box sx={sectionHeaderStyles}>
            <Typography sx={sectionLabelStyles}>Configuration</Typography>
          </Box>
          <Grid container spacing={2}>
            {[
              { name: "active", label: "Active" },
              { name: "paymentPaused", label: "Payment Paused" },
              { name: "subsidyAllowed", label: "Subsidy Allowed" },
              { name: "headLoadAllowed", label: "Head Load Allowed" },
              { name: "incentiveAllowed", label: "Incentive Allowed" },
              { name: "commissionAllowed", label: "Commission Allowed" },
            ].map((config) => (
              <Grid size={{ xs: 12, sm: 6 }} key={config.name}>
                <Box sx={configItemStyles}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {config.label}
                  </Typography>
                  <Controller
                    name={config.name as any}
                    control={control}
                    render={({ field }) => (
                      <HmuSwitch
                        {...field}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        disabled={isViewMode}
                      />
                    )}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      <Box sx={actionContainerStyles}>
        <HmuButton
          label={isViewMode ? "Close" : "Cancel"}
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        />
        {!isViewMode && (
          <HmuButton
            label={isEditMode ? "Update MPCS" : "Create MPCS"}
            type="submit"
            variant="primary"
            loading={isLoading}
          />
        )}
      </Box>
    </Box>
  );
};

export default MpcsForm;
