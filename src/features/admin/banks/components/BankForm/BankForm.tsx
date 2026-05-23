import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  alpha,
} from "@mui/material";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  HmuButton,
  HmuTextField,
  HmuDataField,
  HmuSelect,
} from "../../../../../shared/components";
import {
  formContainerStyles,
  sectionHeaderStyles,
  sectionLabelStyles,
  actionContainerStyles,
  cancelButtonStyles,
  submitButtonStyles,
} from "./BankForm.styles";
import { bankSchema, type BankFormData } from "../../types/bank.schema";
import { useGetUnits } from "../../../../../shared/api/admin/admin.hooks";
import { useNotificationStore } from "../../../../../shared/store/useNotificationStore";
import { palette } from "../../../../../shared/theme";

interface BankFormProps {
  mode: "create" | "edit" | "view";
  onSubmit: (data: BankFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  defaultValues?: Partial<BankFormData> & {
    unit?: { name: string; code: string };
  };
}

const BankForm: React.FC<BankFormProps> = ({
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
  const [isAccountVisible, setIsAccountVisible] = useState(false);

  const unitOptions = useMemo(
    () =>
      units.map((unit) => ({
        label: `${unit.name} (${unit.code})`,
        value: unit.id,
      })),
    [units],
  );

  const accountTypeOptions = [
    { label: "Savings", value: "SAVINGS" },
    { label: "Current", value: "CURRENT" },
  ];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BankFormData>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      unitId: defaultValues?.unitId || "",
      bankName: defaultValues?.bankName || "",
      accountNumber: defaultValues?.accountNumber || "",
      accountType: defaultValues?.accountType || "SAVINGS",
      accountHolderName: defaultValues?.accountHolderName || "",
      ifsc: defaultValues?.ifsc || "",
      branchName: defaultValues?.branchName || "",
      micr: defaultValues?.micr || "",
      contactNumber: defaultValues?.contactNumber || "",
      contactEmail: defaultValues?.contactEmail || "",
    },
  });

  const handleFormSubmit: SubmitHandler<BankFormData> = (data) => {
    onSubmit(data);
  };

  const handleCopy = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showNotification(`${label} copied to clipboard`, "success");
    }
  };

  const maskAccount = (account: string) => {
    if (!account) return "";
    return account.slice(0, -4).replace(/./g, "*") + " " + account.slice(-4);
  };

  const renderDataFieldWithCopy = (
    label: string,
    value: string,
    isMaskable = false,
  ) => {
    const displayValue =
      isMaskable && !isAccountVisible ? maskAccount(value) : value;

    return (
      <HmuDataField
        label={label}
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
                fontFamily: isMaskable
                  ? "'JetBrains Mono', monospace"
                  : "inherit",
              }}
            >
              {displayValue}
            </Typography>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {isMaskable && (
                <Tooltip title={isAccountVisible ? "Hide" : "Show"}>
                  <IconButton
                    size="small"
                    onClick={() => setIsAccountVisible(!isAccountVisible)}
                    sx={{ opacity: 0.6 }}
                  >
                    {isAccountVisible ? (
                      <VisibilityOffIcon fontSize="small" />
                    ) : (
                      <VisibilityIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title={`Copy ${label}`}>
                <IconButton
                  size="small"
                  onClick={() => handleCopy(value, label)}
                  sx={{ opacity: 0.6 }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        }
      />
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Box sx={formContainerStyles}>
        {/* Account Identification Group */}
        <Box>
          <Box sx={sectionHeaderStyles}>
            <Typography sx={sectionLabelStyles}>
              Account Identification
            </Typography>
          </Box>
          <Grid container spacing={2.5}>
            <Grid size={12}>
              {isViewMode ? (
                <HmuDataField
                  label="Associated Unit"
                  value={
                    defaultValues?.unit ? (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {defaultValues.unit.name}
                        </Typography>
                        <Box
                          sx={{
                            fontSize: "0.65rem",
                            fontWeight: 800,
                            bgcolor: alpha(palette.primary.main, 0.1),
                            color: palette.primary.main,
                            px: 1,
                            py: 0.2,
                            borderRadius: "4px",
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >
                          {defaultValues.unit.code}
                        </Box>
                      </Box>
                    ) : (
                      "N/A"
                    )
                  }
                />
              ) : (
                <Controller
                  name="unitId"
                  control={control}
                  render={({ field }) => (
                    <HmuSelect
                      {...field}
                      id="unitId"
                      label="Select Unit"
                      options={unitOptions}
                      required
                      error={!!errors.unitId}
                      helperText={errors.unitId?.message}
                      disabled={isLoading || isEditMode}
                    />
                  )}
                />
              )}
            </Grid>
            <Grid size={6}>
              {isViewMode ? (
                renderDataFieldWithCopy(
                  "Account Holder Name",
                  defaultValues?.accountHolderName || "",
                )
              ) : (
                <HmuTextField
                  id="accountHolderName"
                  label="Account Holder Name"
                  placeholder="Full name as per bank records"
                  required
                  error={!!errors.accountHolderName}
                  helperText={errors.accountHolderName?.message}
                  disabled={isLoading}
                  {...register("accountHolderName")}
                />
              )}
            </Grid>
            <Grid size={6}>
              {isViewMode ? (
                <HmuDataField
                  label="Account Type"
                  value={defaultValues?.accountType}
                />
              ) : (
                <Controller
                  name="accountType"
                  control={control}
                  render={({ field }) => (
                    <HmuSelect
                      {...field}
                      id="accountType"
                      label="Account Type"
                      options={accountTypeOptions}
                      required
                      error={!!errors.accountType}
                      helperText={errors.accountType?.message}
                      disabled={isLoading}
                    />
                  )}
                />
              )}
            </Grid>
          </Grid>
        </Box>

        {/* Bank Details Group */}
        <Box>
          <Box sx={sectionHeaderStyles}>
            <Typography sx={sectionLabelStyles}>Bank Details</Typography>
          </Box>
          <Grid container spacing={2.5}>
            <Grid size={12}>
              {isViewMode ? (
                renderDataFieldWithCopy(
                  "Bank Name",
                  defaultValues?.bankName || "",
                )
              ) : (
                <HmuTextField
                  id="bankName"
                  label="Bank Name"
                  placeholder="e.g. State Bank of India"
                  required
                  error={!!errors.bankName}
                  helperText={errors.bankName?.message}
                  disabled={isLoading}
                  {...register("bankName")}
                />
              )}
            </Grid>
            <Grid size={6}>
              {isViewMode ? (
                renderDataFieldWithCopy(
                  "Account Number",
                  defaultValues?.accountNumber || "",
                  true,
                )
              ) : (
                <HmuTextField
                  id="accountNumber"
                  label="Account Number"
                  placeholder="Enter account number"
                  required
                  error={!!errors.accountNumber}
                  helperText={errors.accountNumber?.message}
                  disabled={isLoading}
                  {...register("accountNumber")}
                />
              )}
            </Grid>
            <Grid size={6}>
              {isViewMode ? (
                renderDataFieldWithCopy("IFSC Code", defaultValues?.ifsc || "")
              ) : (
                <HmuTextField
                  id="ifsc"
                  label="IFSC Code"
                  placeholder="e.g. SBIN0001234"
                  required
                  error={!!errors.ifsc}
                  helperText={errors.ifsc?.message}
                  disabled={isLoading}
                  {...register("ifsc", {
                    onChange: (e) => {
                      e.target.value = e.target.value.toUpperCase();
                    },
                  })}
                />
              )}
            </Grid>
            <Grid size={6}>
              {isViewMode ? (
                renderDataFieldWithCopy(
                  "Branch Name",
                  defaultValues?.branchName || "",
                )
              ) : (
                <HmuTextField
                  id="branchName"
                  label="Branch Name"
                  placeholder="e.g. Main Branch, Kolkata"
                  required
                  error={!!errors.branchName}
                  helperText={errors.branchName?.message}
                  disabled={isLoading}
                  {...register("branchName")}
                />
              )}
            </Grid>
            <Grid size={6}>
              {isViewMode ? (
                renderDataFieldWithCopy("MICR Code", defaultValues?.micr || "")
              ) : (
                <HmuTextField
                  id="micr"
                  label="MICR Code (Optional)"
                  placeholder="9-digit MICR code"
                  error={!!errors.micr}
                  helperText={errors.micr?.message}
                  disabled={isLoading}
                  {...register("micr")}
                />
              )}
            </Grid>
          </Grid>
        </Box>

        {/* Contact Information Group */}
        <Box>
          <Box sx={sectionHeaderStyles}>
            <Typography sx={sectionLabelStyles}>Contact Information</Typography>
          </Box>
          <Grid container spacing={2.5}>
            <Grid size={6}>
              {isViewMode ? (
                renderDataFieldWithCopy(
                  "Contact Number",
                  defaultValues?.contactNumber || "",
                )
              ) : (
                <HmuTextField
                  id="contactNumber"
                  label="Contact Number"
                  placeholder="10-digit mobile number"
                  required
                  error={!!errors.contactNumber}
                  helperText={errors.contactNumber?.message}
                  disabled={isLoading}
                  {...register("contactNumber")}
                />
              )}
            </Grid>
            <Grid size={6}>
              {isViewMode ? (
                renderDataFieldWithCopy(
                  "Contact Email",
                  defaultValues?.contactEmail || "",
                )
              ) : (
                <HmuTextField
                  id="contactEmail"
                  label="Contact Email"
                  placeholder="e.g. contact@bank.com"
                  required
                  error={!!errors.contactEmail}
                  helperText={errors.contactEmail?.message}
                  disabled={isLoading}
                  {...register("contactEmail")}
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
            label={isEditMode ? "Save Changes" : "Create Account"}
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

export default BankForm;
