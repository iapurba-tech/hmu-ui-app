import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  DatePicker,
  type DatePickerProps,
} from "@mui/x-date-pickers/DatePicker";
import { Box, FormLabel, FormHelperText } from "@mui/material";
import { datePickerStyles, labelStyles } from "./HmuDatePicker.styles";

export interface HmuDatePickerProps extends Omit<
  DatePickerProps,
  "renderInput"
> {
  id?: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  error?: boolean;
  fullWidth?: boolean;
}

const HmuDatePicker: React.FC<HmuDatePickerProps> = ({
  id,
  label,
  helperText,
  required,
  error,
  fullWidth = true,
  sx,
  ...props
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: fullWidth ? "100%" : "auto" }}>
        {label && (
          <FormLabel error={error} required={required} sx={labelStyles}>
            {label}
          </FormLabel>
        )}
        <DatePicker
          {...props}
          sx={[datePickerStyles, ...(Array.isArray(sx) ? sx : [sx])]}
          slotProps={{
            textField: {
              error,
              required,
              fullWidth,
              helperText: null, // We handle helperText manually
              size: "small",
            },
          }}
        />
        {helperText && (
          <FormHelperText error={error} sx={{ mt: 0.5 }}>
            {helperText}
          </FormHelperText>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default HmuDatePicker;
