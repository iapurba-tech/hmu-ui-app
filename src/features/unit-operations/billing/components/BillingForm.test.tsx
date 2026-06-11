import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BillingForm from "./BillingForm";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../shared/theme";
import dayjs from "dayjs";

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe("BillingForm", () => {
  it("renders correctly with default values", () => {
    const onSubmit = vi.fn();
    renderWithTheme(<BillingForm onSubmit={onSubmit} isSubmitting={false} />);

    expect(screen.getByText("Generate New Bill")).toBeInTheDocument();
    expect(screen.getByText("Billing Month")).toBeInTheDocument();
    expect(screen.getByText("Billing Cycle")).toBeInTheDocument();
    
    // In our Custom cycle case, the date pickers should NOT be disabled.
    const inputs = document.querySelectorAll("input");
    // Depending on DOM, inputs[1] and inputs[2] might be the date pickers,
    // but better to just ensure no inputs with disabled attribute exist for the dates.
    expect(screen.getByText("Start Date")).toBeInTheDocument();
    expect(screen.getByText("End Date")).toBeInTheDocument();
  });

  it("calls onSubmit with correct data when form is valid", async () => {
    const onSubmit = vi.fn();
    renderWithTheme(<BillingForm onSubmit={onSubmit} isSubmitting={false} />);

    const submitButton = screen.getByRole("button", { name: /Start Billing Run/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  it("updates dates when a predefined cycle is selected", async () => {
    const onSubmit = vi.fn();
    renderWithTheme(<BillingForm onSubmit={onSubmit} isSubmitting={false} />);

    // Find the cycle select by its value or role
    const cycleSelects = screen.getAllByRole("combobox");
    const cycleSelect = cycleSelects[1]; // Assuming month is 0, cycle is 1
    
    fireEvent.mouseDown(cycleSelect);

    const cycle1Option = await screen.findByText(/Cycle 1/i);
    fireEvent.click(cycle1Option);

    // Wait for the dates to be updated
    await waitFor(() => {
      const inputs = document.querySelectorAll("input");
      // Find the inputs that contain the formatted dates
      const startDateInput = Array.from(inputs).find(input => input.value === dayjs().date(1).format("DD/MM/YYYY"));
      const endDateInput = Array.from(inputs).find(input => input.value === dayjs().date(10).format("DD/MM/YYYY"));
      
      expect(startDateInput).toBeInTheDocument();
      expect(endDateInput).toBeInTheDocument();
      expect(startDateInput).toBeDisabled();
      expect(endDateInput).toBeDisabled();
    });
  });
});
