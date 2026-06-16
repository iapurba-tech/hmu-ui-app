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
import { useForm, Controller, useWatch, type SubmitHandler } from "react-hook-form";
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
  MilkCollection,
  MilkCollectionCreateRequest,
} from "../types/milk-collection.types";
import {
  formContainerStyles,
  stagingAreaStyles,
} from "../MilkCollectionsPage/MilkCollectionsPage.styles";
import {
  calculateSnfPercentage,
  calculateKg,
} from "../utils/milk-calculations";

const milkCollectionSchema = z.object({
  mpcsId: z.string().min(1, "MPCS is required"),
  collectionDate: z.string().min(1, "Date is required"),
  shift: z.enum(["MORNING", "EVENING"]),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  fatPercentage: z.number().min(0.1, "Fat % must be greater than 0"),
  clr: z.number().min(0, "CLR is required"),
});

type FormValues = z.infer<typeof milkCollectionSchema>;

interface MilkCollectionFormProps {
  onSubmit: (
    data: MilkCollectionCreateRequest | MilkCollectionCreateRequest[],
    onSuccess?: () => void,
  ) => void;
  onUpdate: (
    id: string,
    data: MilkCollectionCreateRequest,
    onSuccess?: () => void,
  ) => void;
  initialData: MilkCollection | null;
  mpcsOptions: { label: string; value: string }[];
  isSubmitting: boolean;
  onCancel: () => void;
}

const MilkCollectionForm: React.FC<MilkCollectionFormProps> = ({
  onSubmit,
  onUpdate,
  initialData,
  mpcsOptions,
  isSubmitting,
  onCancel,
}) => {
  const [pendingList, setPendingList] = useState<MilkCollectionCreateRequest[]>(
    [],
  );

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(milkCollectionSchema),
    defaultValues: {
      mpcsId: "",
      collectionDate: dayjs().format("YYYY-MM-DD"),
      shift: "MORNING",
      quantity: 0,
      fatPercentage: 0,
      clr: 0,
    },
  });

  // Handle initial data changes (Add vs Edit mode)
  useEffect(() => {
    if (initialData) {
      reset({
        mpcsId: initialData.mpcsId,
        collectionDate: initialData.collectionDate,
        shift: initialData.shift,
        quantity: initialData.quantity,
        fatPercentage: initialData.fatPercentage,
        clr: initialData.clr,
      });
      // Use a timeout or move to parent to avoid synchronous setState during render
      const timer = setTimeout(() => {
        setPendingList([]);
      }, 0);
      return () => clearTimeout(timer);
    } else {
      reset({
        mpcsId: "",
        collectionDate: dayjs().format("YYYY-MM-DD"),
        shift: "MORNING",
        quantity: 0,
        fatPercentage: 0,
        clr: 0,
      });
    }
  }, [initialData, reset]);

  const watchedValues = useWatch({
    control,
    name: ["quantity", "fatPercentage", "clr"],
  });

  const [watchQuantity, watchFat, watchClr] = watchedValues;

  const snfPercentage = calculateSnfPercentage(
    Number(watchFat || 0),
    Number(watchClr || 0),
  );
  const fatKg = calculateKg(Number(watchQuantity || 0), Number(watchFat || 0));
  const snfKg = calculateKg(Number(watchQuantity || 0), snfPercentage);

  const filteredMpcsOptions = useMemo(() => {
    const pendingIds = new Set(pendingList.map((item) => item.mpcsId));
    return mpcsOptions.filter((option) => !pendingIds.has(option.value));
  }, [mpcsOptions, pendingList]);

  const handleAddToList: SubmitHandler<FormValues> = (data) => {
    setPendingList((prev) => [...prev, data]);
    setValue("mpcsId", "");
    setValue("quantity", 0);
    setValue("fatPercentage", 0);
    setValue("clr", 0);
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
          {initialData ? "Edit Collection" : "Record Collection"}
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
        {/* Left Side: Input Fields */}
        <Grid size={{ xs: 12, md: 8.5 }}>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="collectionDate"
                control={control}
                render={({ field }) => (
                  <HmuDatePicker
                    label="Collection Date"
                    value={dayjs(field.value)}
                    onChange={(date) =>
                      field.onChange(date ? date.format("YYYY-MM-DD") : "")
                    }
                    error={!!errors.collectionDate}
                    helperText={errors.collectionDate?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="shift"
                control={control}
                render={({ field }) => (
                  <HmuSelect
                    label="Shift"
                    options={[
                      { label: "Morning", value: "MORNING" },
                      { label: "Evening", value: "EVENING" },
                    ]}
                    {...field}
                    error={!!errors.shift}
                    helperText={errors.shift?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
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

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="quantity"
                control={control}
                render={({ field }) => (
                  <HmuTextField
                    label="Quantity (kg)"
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
                name="fatPercentage"
                control={control}
                render={({ field }) => (
                  <HmuTextField
                    label="Fat %"
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    error={!!errors.fatPercentage}
                    helperText={errors.fatPercentage?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="clr"
                control={control}
                render={({ field }) => (
                  <HmuTextField
                    label="CLR"
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    error={!!errors.clr}
                    helperText={errors.clr?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Right Side: Calculations Display */}
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
                mb: 0.5,
              }}
            >
              Auto Calculated Fields
            </Typography>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={700}
                sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
              >
                Calculated SNF %
              </Typography>
              <Typography
                variant="h5"
                fontWeight={900}
                color="primary.main"
                sx={{ lineHeight: 1 }}
              >
                {snfPercentage || "0.00"}%
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={700}
                  sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
                >
                  Fat KG
                </Typography>
                <Typography
                  variant="subtitle1"
                  fontWeight={800}
                  color="text.primary"
                  sx={{ lineHeight: 1 }}
                >
                  {fatKg || "0.000"}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={700}
                  sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
                >
                  SNF KG
                </Typography>
                <Typography
                  variant="subtitle1"
                  fontWeight={800}
                  color="text.primary"
                  sx={{ lineHeight: 1 }}
                >
                  {snfKg || "0.000"}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} justifyContent="flex-end">
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
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Qty (kg)
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Fat %
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    CLR
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    SNF %
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Fat KG
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    SNF KG
                  </TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingList.map((item, index) => {
                  const itemSnf = calculateSnfPercentage(
                    item.fatPercentage,
                    item.clr,
                  );
                  const itemFatKg = calculateKg(
                    item.quantity,
                    item.fatPercentage,
                  );
                  const itemSnfKg = calculateKg(item.quantity, itemSnf);

                  return (
                    <TableRow key={index}>
                      <TableCell>
                        {
                          mpcsOptions.find((o) => o.value === item.mpcsId)
                            ?.label
                        }
                      </TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{item.fatPercentage}%</TableCell>
                      <TableCell align="right">{item.clr}</TableCell>
                      <TableCell align="right">{itemSnf}%</TableCell>
                      <TableCell align="right">{itemFatKg}</TableCell>
                      <TableCell align="right">{itemSnfKg}</TableCell>
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

export default MilkCollectionForm;
