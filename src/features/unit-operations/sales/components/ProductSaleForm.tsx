import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  alpha,
} from "@mui/material";
import {
  useForm,
  Controller,
  useWatch,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dayjs from "dayjs";
import {
  HmuTextField,
  HmuSelect,
  HmuDatePicker,
  HmuButton,
} from "../../../../shared/components";
import {
  AddIcon,
  SaveIcon,
  CancelIcon,
  DeleteIcon,
  CloseIcon,
} from "../../../../shared/icons";
import { palette } from "../../../../shared/theme";
import type {
  ProductSale,
  ProductSaleCreateRequest,
} from "../types/product-sale.types";
import type { Product } from "../../../admin/products/types/product.types";
import {
  formContainerStyles,
  stagingAreaStyles,
} from "../../milk-collections/MilkCollectionsPage/MilkCollectionsPage.styles";

const productSaleSchema = z.object({
  mpcsId: z.string().min(1, "MPCS is required"),
  productId: z.string().min(1, "Product is required"),
  saleDate: z.string().min(1, "Date is required"),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  price: z.number().min(0, "Price must be at least 0"),
  remarks: z.string().optional(),
});

type FormValues = z.infer<typeof productSaleSchema>;

interface ProductSaleFormProps {
  onSubmit: (
    data: ProductSaleCreateRequest | ProductSaleCreateRequest[],
    onSuccess?: () => void,
  ) => void;
  onUpdate: (
    id: string,
    data: ProductSaleCreateRequest,
    onSuccess?: () => void,
  ) => void;
  initialData: ProductSale | null;
  mpcsOptions: { label: string; value: string }[];
  products: Product[];
  isSubmitting: boolean;
  onCancel: () => void;
}

const ProductSaleForm: React.FC<ProductSaleFormProps> = ({
  onSubmit,
  onUpdate,
  initialData,
  mpcsOptions,
  products,
  isSubmitting,
  onCancel,
}) => {
  const [pendingList, setPendingList] = useState<ProductSaleCreateRequest[]>(
    [],
  );

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(productSaleSchema),
    defaultValues: {
      mpcsId: "",
      productId: "",
      saleDate: dayjs().format("YYYY-MM-DD"),
      quantity: 0,
      price: 0,
      remarks: "",
    },
  });

  const watchedValues = useWatch({
    control,
    name: ["quantity", "price", "productId"],
  });

  const [watchQuantity, watchPrice, watchProductId] = watchedValues;

  // Auto-populate price when product changes
  useEffect(() => {
    if (watchProductId && !initialData) {
      const product = products.find((p) => p.id === watchProductId);
      if (product) {
        setValue("price", product.defaultPrice);
      }
    }
  }, [watchProductId, products, setValue, initialData]);

  const totalAmount = Number(watchQuantity || 0) * Number(watchPrice || 0);

  const filteredMpcsOptions = useMemo(() => {
    // Unlike milk collections, multiple sales might be possible for same MPCS (different products)
    // So we don't strictly filter out MPCS unless desired.
    // However, let's filter out same MPCS + Product combination in draft
    return mpcsOptions;
  }, [mpcsOptions]);

  const productOptions = useMemo(
    () =>
      products.map((p) => ({ label: `${p.name} (${p.code})`, value: p.id })),
    [products],
  );

  useEffect(() => {
    if (initialData) {
      reset({
        mpcsId: initialData.mpcsId,
        productId: initialData.productId,
        saleDate: initialData.saleDate,
        quantity: initialData.quantity,
        price: initialData.price,
        remarks: initialData.remarks || "",
      });
      const timer = setTimeout(() => {
        setPendingList([]);
      }, 0);
      return () => clearTimeout(timer);
    } else {
      reset({
        mpcsId: "",
        productId: "",
        saleDate: dayjs().format("YYYY-MM-DD"),
        quantity: 0,
        price: 0,
        remarks: "",
      });
    }
  }, [initialData, reset]);

  const handleAddToList: SubmitHandler<FormValues> = (data) => {
    setPendingList((prev) => [...prev, data]);
    // Reset product specific fields but keep MPCS and Date for quick entry
    setValue("productId", "");
    setValue("quantity", 0);
    setValue("price", 0);
    setValue("remarks", "");
  };

  const handleRemoveFromList = (index: number) => {
    setPendingList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
    if (initialData) {
      onUpdate(initialData.id, data, () => {
        reset();
      });
    } else if (pendingList.length > 0) {
      onSubmit([...pendingList, data], () => {
        setPendingList([]);
        reset();
      });
    } else {
      onSubmit(data, () => {
        reset();
      });
    }
  };

  const handleSaveAll = () => {
    if (pendingList.length > 0) {
      onSubmit(pendingList, () => {
        setPendingList([]);
        reset();
      });
    }
  };

  return (
    <Box sx={formContainerStyles}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          {initialData ? "Edit Sale" : "Record Sale"}
        </Typography>
        <IconButton
          onClick={onCancel}
          size="small"
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Grid container spacing={3} alignItems="stretch">
        <Grid size={{ xs: 12, md: 8.5 }}>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="saleDate"
                control={control}
                render={({ field }) => (
                  <HmuDatePicker
                    label="Sale Date"
                    value={dayjs(field.value)}
                    onChange={(date) =>
                      field.onChange(date ? date.format("YYYY-MM-DD") : "")
                    }
                    error={!!errors.saleDate}
                    helperText={errors.saleDate?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="mpcsId"
                control={control}
                render={({ field }) => (
                  <HmuSelect
                    label="Select MPCS"
                    options={filteredMpcsOptions}
                    {...field}
                    error={!!errors.mpcsId}
                    helperText={errors.mpcsId?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                name="productId"
                control={control}
                render={({ field }) => (
                  <HmuSelect
                    label="Select Product"
                    options={productOptions}
                    {...field}
                    error={!!errors.productId}
                    helperText={errors.productId?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="quantity"
                control={control}
                render={({ field }) => (
                  <HmuTextField
                    label="Quantity"
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    error={!!errors.quantity}
                    helperText={errors.quantity?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <HmuTextField
                    label="Price"
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    error={!!errors.price}
                    helperText={errors.price?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="remarks"
                control={control}
                render={({ field }) => (
                  <HmuTextField
                    label="Remarks"
                    {...field}
                    error={!!errors.remarks}
                    helperText={errors.remarks?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, md: 3.5 }}>
          <Box
            sx={{
              p: 2,
              height: "100%",
              backgroundColor: alpha(palette.primary.main, 0.03),
              borderRadius: "12px",
              border: `1px solid ${alpha(palette.primary.main, 0.1)}`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 1.5,
              boxShadow: `0 2px 4px ${alpha(palette.primary.main, 0.05)}`,
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: palette.primary.main,
                fontWeight: 800,
                letterSpacing: "0.12em",
                display: "block",
                lineHeight: 1,
                mb: 1,
              }}
            >
              Bill Summary
            </Typography>

            <Stack spacing={1.5}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Unit Price
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  ₹
                  {Number(watchPrice || 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Quantity
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {Number(watchQuantity || 0)}
                </Typography>
              </Box>
              <Box
                sx={{
                  borderTop: `1px dashed ${alpha(palette.primary.main, 0.2)}`,
                  my: 0.5,
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <Typography variant="subtitle2" fontWeight={700}>
                  Net Amount
                </Typography>
                <Typography variant="h5" fontWeight={900} color="primary.main">
                  ₹
                  {totalAmount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Grid>
      </Grid>

      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        sx={{ mt: 3 }}
      >
        {initialData ? (
          <HmuButton
            label="Cancel"
            variant="text"
            startIcon={<CancelIcon />}
            onClick={onCancel}
            sx={{ color: palette.text.secondary }}
          />
        ) : (
          pendingList.length > 0 && (
            <HmuButton
              label="Clear List"
              variant="text"
              startIcon={<CancelIcon />}
              onClick={() => {
                setPendingList([]);
                onCancel();
              }}
              sx={{ color: palette.text.secondary }}
            />
          )
        )}
        {!initialData && (
          <HmuButton
            label="Add Draft"
            variant="secondary"
            startIcon={<AddIcon />}
            onClick={handleSubmit(handleAddToList)}
          />
        )}
        <HmuButton
          label={initialData ? "Update" : "Save"}
          variant="primary"
          startIcon={<SaveIcon />}
          onClick={handleSubmit(handleFormSubmit)}
          loading={isSubmitting}
        />
      </Stack>

      {pendingList.length > 0 && (
        <Box sx={stagingAreaStyles}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle2" fontWeight={700}>
              Pending Drafts
            </Typography>
            <HmuButton
              label={`Save All ${pendingList.length} Drafts`}
              size="small"
              onClick={handleSaveAll}
              loading={isSubmitting}
            />
          </Box>
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ borderRadius: "8px" }}
          >
            <Table size="small">
              <TableHead sx={{ backgroundColor: palette.background.default }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>MPCS</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Qty
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Price
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Amount
                  </TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingList.map((item, index) => {
                  const amount = item.quantity * item.price;
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        {
                          mpcsOptions.find((o) => o.value === item.mpcsId)
                            ?.label
                        }
                      </TableCell>
                      <TableCell>
                        {products.find((p) => p.id === item.productId)?.name}
                      </TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">₹{item.price}</TableCell>
                      <TableCell align="right">₹{amount.toFixed(2)}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveFromList(index)}
                          sx={{ color: "error.main" }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default ProductSaleForm;
