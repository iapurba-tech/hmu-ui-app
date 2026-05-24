import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  HmuButton,
  HmuTextField,
  HmuDataField,
  HmuSelect,
  HmuSwitch,
} from "../../../../../shared/components";
import {
  formContainerStyles,
  sectionHeaderStyles,
  sectionLabelStyles,
  actionContainerStyles,
  cancelButtonStyles,
  submitButtonStyles,
  categoryBadgeStyles,
} from "./ProductForm.styles";
import { productSchema, type ProductFormData } from "../../types/product.schema";

interface ProductFormProps {
  mode: "create" | "edit" | "view";
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  defaultValues?: Partial<ProductFormData> & { code?: string };
}

const ProductForm: React.FC<ProductFormProps> = ({
  mode,
  onSubmit,
  onCancel,
  isLoading = false,
  defaultValues,
}) => {
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const categoryOptions = [
    { label: "Feed", value: "FEED" },
    { label: "Stationery", value: "STATIONERY" },
    { label: "Other", value: "OTHER" },
  ];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      category: defaultValues?.category || "FEED",
      uom: defaultValues?.uom || "",
      defaultPrice: defaultValues?.defaultPrice || 0,
      description: defaultValues?.description || "",
      isInStock: defaultValues?.isInStock ?? true,
    },
  });

  const handleFormSubmit: SubmitHandler<ProductFormData> = (data) => {
    onSubmit(data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit as any)}
      noValidate
    >
      <Box sx={formContainerStyles}>
        {/* Product Basic Info */}
        <Box>
          <Box sx={sectionHeaderStyles}>
            <Typography sx={sectionLabelStyles}>Product Information</Typography>
            {isViewMode && defaultValues?.code && (
              <Box
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  bgcolor: "action.hover",
                  px: 1,
                  py: 0.3,
                  borderRadius: "4px",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {defaultValues.code}
              </Box>
            )}
          </Box>
          <Grid container spacing={2.5}>
            <Grid size={12}>
              {isViewMode ? (
                <HmuDataField label="Product Name" value={defaultValues?.name} />
              ) : (
                <HmuTextField
                  id="name"
                  label="Product Name"
                  placeholder="Enter product name"
                  required
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isLoading}
                  {...register("name")}
                />
              )}
            </Grid>
            <Grid size={6}>
              {isViewMode ? (
                <HmuDataField
                  label="Category"
                  value={
                    <Box sx={categoryBadgeStyles(defaultValues?.category || "")}>
                      {defaultValues?.category}
                    </Box>
                  }
                />
              ) : (
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <HmuSelect
                      {...field}
                      id="category"
                      label="Category"
                      options={categoryOptions}
                      required
                      error={!!errors.category}
                      helperText={errors.category?.message}
                      disabled={isLoading}
                    />
                  )}
                />
              )}
            </Grid>
            <Grid size={6}>
              {isViewMode ? (
                <HmuDataField label="Measuring Unit" value={defaultValues?.uom} />
              ) : (
                <HmuTextField
                  id="uom"
                  label="Measuring Unit"
                  placeholder="e.g. KG, Litre, Bag"
                  required
                  error={!!errors.uom}
                  helperText={errors.uom?.message}
                  disabled={isLoading}
                  {...register("uom")}
                />
              )}
            </Grid>
            <Grid size={6}>
              {isViewMode ? (
                <HmuDataField
                  label="MRP"
                  value={`₹${defaultValues?.defaultPrice?.toFixed(2)}`}
                />
              ) : (
                <HmuTextField
                  id="defaultPrice"
                  label="MRP"
                  type="number"
                  placeholder="0.00"
                  required
                  error={!!errors.defaultPrice}
                  helperText={errors.defaultPrice?.message}
                  disabled={isLoading}
                  {...register("defaultPrice", { valueAsNumber: true })}
                />
              )}
            </Grid>
            <Grid size={6}>
              {isViewMode ? (
                <HmuDataField
                  label="In Stock"
                  value={defaultValues?.isInStock ? "Yes" : "No"}
                />
              ) : (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 0.5 }}>
                    In Stock
                  </Typography>
                  <Controller
                    name="isInStock"
                    control={control}
                    render={({ field }) => (
                      <HmuSwitch
                        checked={field.value}
                        onChange={field.onChange}
                        disabled={isLoading}
                      />
                    )}
                  />
                </Box>
              )}
            </Grid>
            <Grid size={12}>
              {isViewMode ? (
                <HmuDataField
                  label="Description"
                  value={defaultValues?.description || "No description provided"}
                />
              ) : (
                <HmuTextField
                  id="description"
                  label="Description"
                  placeholder="Optional product description"
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  disabled={isLoading}
                  {...register("description")}
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
            label={isEditMode ? "Save Changes" : "Create Product"}
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

export default ProductForm;
