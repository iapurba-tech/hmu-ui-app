import React from "react";
import {
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  FormHelperText,
  OutlinedInput,
  Checkbox,
  ListItemText,
  type SelectProps,
  Box,
  Chip,
} from "@mui/material";
import {
  labelStyles,
  formControlStyles,
} from "../HmuTextField/HmuTextField.styles";
import {
  selectStyles,
  chipStyles,
  menuPaperStyles,
  menuItemStyles,
  checkboxStyles,
  chipContainerStyles,
} from "./HmuSelect.styles";

export interface HmuSelectOption {
  label: string;
  value: string | number;
  secondaryLabel?: string;
}

export interface HmuSelectProps extends Omit<SelectProps, "label"> {
  label?: string;
  helperText?: string;
  options: HmuSelectOption[];
  showCheckbox?: boolean;
  renderChips?: boolean;
}

const HmuSelect = React.forwardRef<HTMLDivElement, HmuSelectProps>(
  (
    {
      label,
      helperText,
      options,
      required,
      error,
      id,
      fullWidth = true,
      multiple,
      showCheckbox = true,
      renderChips = false,
      sx,
      value,
      ...props
    },
    ref,
  ) => {
    const getOptionLabel = (val: any) => {
      const option = options.find((opt) => opt.value === val);
      return option ? option.label : val;
    };

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
        <Select
          id={id}
          multiple={multiple}
          value={value}
          input={<OutlinedInput notched={false} sx={selectStyles} />}
          renderValue={(selected) => {
            if (multiple) {
              const selectedArray = selected as any[];
              if (selectedArray.length === 0) return null;

              if (renderChips) {
                return (
                  <Box sx={chipContainerStyles}>
                    {selectedArray.map((val) => (
                      <Chip
                        key={val}
                        label={getOptionLabel(val)}
                        size="small"
                        sx={chipStyles}
                      />
                    ))}
                  </Box>
                );
              }

              return selectedArray.map(getOptionLabel).join(", ");
            }
            return getOptionLabel(selected);
          }}
          MenuProps={{
            PaperProps: {
              sx: menuPaperStyles,
            },
          }}
          {...props}
        >
          {options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={menuItemStyles}
            >
              {multiple && showCheckbox && (
                <Checkbox
                  checked={((value as any[]) || []).indexOf(option.value) > -1}
                  size="small"
                  sx={checkboxStyles}
                />
              )}
              <ListItemText
                primary={option.label}
                secondary={option.secondaryLabel}
                slotProps={{
                  primary: { fontSize: "14px" },
                  secondary: { fontSize: "12px" },
                }}
              />
            </MenuItem>
          ))}
        </Select>
        {helperText && (
          <FormHelperText error={error}>{helperText}</FormHelperText>
        )}
      </FormControl>
    );
  },
);

HmuSelect.displayName = "HmuSelect";

export default HmuSelect;
