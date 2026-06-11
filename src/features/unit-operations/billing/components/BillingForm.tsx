import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dayjs from "dayjs";
import {
  HmuDatePicker,
  HmuButton,
  HmuSelect,
} from "../../../../shared/components";
import { PlayArrowIcon } from "../../../../shared/icons";
import type { BillingRunCreateRequest } from "../types/billing.types";
import { sectionPaperStyles } from "../pages/BillingPage/BillingPage.styles";

const billingSchema = z
  .object({
    month: z.string().optional(),
    cycle: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  })
  .refine(
    (data) => {
      return (
        dayjs(data.endDate).isAfter(dayjs(data.startDate)) ||
        dayjs(data.endDate).isSame(dayjs(data.startDate))
      );
    },
    {
      message: "End date must be after or same as start date",
      path: ["endDate"],
    },
  )
  .refine(
    (data) => {
      return (
        dayjs(data.startDate).isBefore(dayjs(data.endDate)) ||
        dayjs(data.startDate).isSame(dayjs(data.endDate))
      );
    },
    {
      message: "Start date must be before or same as end date",
      path: ["startDate"],
    },
  );

type FormValues = z.infer<typeof billingSchema>;

interface BillingFormProps {
  onSubmit: (data: Omit<BillingRunCreateRequest, "unitId">) => void;
  isSubmitting: boolean;
}

const CYCLE_OPTIONS = [
  { label: "Cycle 1 (1st - 10th)", value: "CYCLE_1" },
  { label: "Cycle 2 (11th - 20th)", value: "CYCLE_2" },
  { label: "Cycle 3 (21st - End)", value: "CYCLE_3" },
  { label: "Custom Range", value: "CUSTOM" },
];

const MONTH_OPTIONS = Array.from({ length: 12 }).map((_, i) => {
  const d = dayjs().subtract(i, "month");
  return { label: d.format("MMMM YYYY"), value: d.format("YYYY-MM") };
});

const BillingForm: React.FC<BillingFormProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      month: dayjs().format("YYYY-MM"),
      cycle: "CUSTOM",
      startDate: dayjs().format("YYYY-MM-DD"),
      endDate: dayjs().format("YYYY-MM-DD"),
    },
  });

  const selectedCycle = useWatch({
    control,
    name: "cycle",
  });

  const handleDateCalculation = (selectedMonth: string, cycle: string) => {
    if (cycle === "CUSTOM") return;

    const baseDate = dayjs(selectedMonth, "YYYY-MM");
    const startOfMonth = baseDate.startOf("month");
    const endOfMonth = baseDate.endOf("month");

    let start = "";
    let end = "";

    switch (cycle) {
      case "CYCLE_1":
        start = startOfMonth.date(1).format("YYYY-MM-DD");
        end = startOfMonth.date(10).format("YYYY-MM-DD");
        break;
      case "CYCLE_2":
        start = startOfMonth.date(11).format("YYYY-MM-DD");
        end = startOfMonth.date(20).format("YYYY-MM-DD");
        break;
      case "CYCLE_3":
        start = startOfMonth.date(21).format("YYYY-MM-DD");
        end = endOfMonth.format("YYYY-MM-DD");
        break;
    }

    if (start && end) {
      setValue("startDate", start);
      setValue("endDate", end);
    }
  };

  const handleFormSubmit = (data: FormValues) => {
    const { startDate, endDate } = data;
    onSubmit({ startDate, endDate });
  };

  return (
    <Box sx={sectionPaperStyles}>
      <Typography variant="h6" fontWeight={700}>
        Generate New Bill
      </Typography>

      <Stack spacing={3}>
        <Controller
          name="month"
          control={control}
          render={({ field }) => (
            <HmuSelect
              label="Billing Month"
              options={MONTH_OPTIONS}
              {...field}
              onChange={(e) => {
                field.onChange(e);
                const currentCycle = getValues("cycle") || "CUSTOM";
                handleDateCalculation(e.target.value as string, currentCycle);
              }}
              error={!!errors.month}
              helperText={errors.month?.message}
              fullWidth
              disabled={selectedCycle === "CUSTOM"}
            />
          )}
        />

        <Controller
          name="cycle"
          control={control}
          render={({ field }) => (
            <HmuSelect
              label="Billing Cycle"
              options={CYCLE_OPTIONS}
              {...field}
              onChange={(e) => {
                field.onChange(e);
                const currentMonth = getValues("month") || dayjs().format("YYYY-MM");
                handleDateCalculation(currentMonth, e.target.value as string);
              }}
              error={!!errors.cycle}
              helperText={errors.cycle?.message}
              fullWidth
            />
          )}
        />

        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <HmuDatePicker
              label="Start Date"
              format="DD/MM/YYYY"
              value={dayjs(field.value)}
              onChange={(date) =>
                field.onChange(date ? date.format("YYYY-MM-DD") : "")
              }
              error={!!errors.startDate}
              helperText={errors.startDate?.message}
              disabled={selectedCycle !== "CUSTOM"}
            />
          )}
        />

        <Controller
          name="endDate"
          control={control}
          render={({ field }) => (
            <HmuDatePicker
              label="End Date"
              format="DD/MM/YYYY"
              value={dayjs(field.value)}
              onChange={(date) =>
                field.onChange(date ? date.format("YYYY-MM-DD") : "")
              }
              error={!!errors.endDate}
              helperText={errors.endDate?.message}
              disabled={selectedCycle !== "CUSTOM"}
            />
          )}
        />

        <HmuButton
          label="Start Billing Run"
          variant="primary"
          startIcon={<PlayArrowIcon />}
          onClick={handleSubmit(handleFormSubmit)}
          loading={isSubmitting}
          fullWidth
        />
      </Stack>
    </Box>
  );
};

export default BillingForm;
