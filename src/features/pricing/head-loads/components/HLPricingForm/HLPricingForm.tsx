import React, { useState } from "react";
import { Box, Typography, Grid, Button, Chip } from "@mui/material";
import dayjs from "dayjs";
import { HmuTextField, HmuDatePicker } from "../../../../../shared/components";
import type { HeadLoadCategory } from "../../types/head-load-category.types";
import {
  formCardStyles,
  formHeaderStyles,
  categoryTitleStyles,
  codeChipStyles,
  formContentStyles,
  sectionLabelStyles,
  priceRangeContainerStyles,
} from "./HLPricingForm.styles";

export interface HLPricingFormValues {
  quantityFrom: number;
  rate: number;
  effectiveFrom: string;
}

interface HLPricingFormProps {
  category: HeadLoadCategory | undefined;
  onSubmit: (values: HLPricingFormValues) => void;
  loading?: boolean;
}

const HLPricingForm: React.FC<HLPricingFormProps> = ({
  category,
  onSubmit,
  loading = false,
}) => {
  const [values, setValues] = useState<HLPricingFormValues>({
    quantityFrom: 0,
    rate: 0,
    effectiveFrom: dayjs().format("YYYY-MM-DD"),
  });

  const handleSubmit = () => {
    onSubmit(values);
  };

  // Reset form after successful submit (monitored via loading transition if needed)
  // Or handled by parent. For now, we provide the handle.

  return (
    <Box sx={formCardStyles}>
      <Box sx={formHeaderStyles}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography sx={categoryTitleStyles}>
            {category?.description || "Select Category"}
          </Typography>
          {category?.code && <Chip label={category.code} sx={codeChipStyles} />}
        </Box>
      </Box>

      <Box sx={formContentStyles}>
        <Box sx={priceRangeContainerStyles}>
          <Typography sx={sectionLabelStyles}>Update HLC Pricing</Typography>
          <Grid container spacing={2}>
            <Grid size={12}>
              <HmuTextField
                id="quantity-from"
                label="Qty From (Kg)"
                type="number"
                fullWidth
                required
                value={values.quantityFrom}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    quantityFrom: Number(e.target.value),
                  }))
                }
              />
            </Grid>
            <Grid size={12}>
              <HmuTextField
                id="rate"
                label="Rate (₹)"
                type="number"
                fullWidth
                required
                value={values.rate}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    rate: Number(e.target.value),
                  }))
                }
              />
            </Grid>
            <Grid size={12}>
              <HmuDatePicker
                id="effective-from"
                label="Effective From"
                value={dayjs(values.effectiveFrom)}
                required
                onChange={(date: dayjs.Dayjs | null) =>
                  setValues((prev) => ({
                    ...prev,
                    effectiveFrom: date?.format("YYYY-MM-DD") || "",
                  }))
                }
              />
            </Grid>
            <Grid size={12}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSubmit}
                disabled={loading || !category}
                sx={{ mt: 1, borderRadius: "10px", py: 1 }}
              >
                Update
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default HLPricingForm;
