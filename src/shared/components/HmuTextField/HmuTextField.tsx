import React from "react";
import {
  FormControl,
  FormLabel,
  OutlinedInput,
  FormHelperText,
  InputAdornment,
  type OutlinedInputProps,
} from "@mui/material";
import {
  labelStyles,
  outlinedInputStyles,
  formControlStyles,
} from "./HmuTextField.styles";

export interface HmuTextFieldProps extends Omit<OutlinedInputProps, "label"> {
  label?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const HmuTextField = React.forwardRef<HTMLDivElement, HmuTextFieldProps>(
  (
    {
      label,
      helperText,
      startIcon,
      endIcon,
      required,
      error,
      id,
      fullWidth = true,
      sx,
      inputRef,
      ...props
    },
    ref
  ) => {
    return (
      <FormControl
        fullWidth={fullWidth}
        error={error}
        sx={[formControlStyles, ...(Array.isArray(sx) ? sx : [sx])]}
        ref={ref}
      >
        {label && (
          <FormLabel htmlFor={id} required={required} sx={labelStyles}>
            {label}
          </FormLabel>
        )}
        <OutlinedInput
          id={id}
          notched={false}
          inputRef={inputRef}
          startAdornment={
            startIcon ? (
              <InputAdornment position="start">{startIcon}</InputAdornment>
            ) : null
          }
          endAdornment={
            endIcon ? (
              <InputAdornment position="end">{endIcon}</InputAdornment>
            ) : null
          }
          sx={outlinedInputStyles}
          {...props}
        />
        {helperText && (
          <FormHelperText error={error}>{helperText}</FormHelperText>
        )}
      </FormControl>
    );
  }
);

HmuTextField.displayName = "HmuTextField";

export default HmuTextField;
