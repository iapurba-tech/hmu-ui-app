import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HLPricingForm from "./HLPricingForm";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../../shared/theme";
import dayjs from "dayjs";
import type { HeadLoadCategory } from "../../types/head-load-category.types";

const mockCategory: HeadLoadCategory = {
  id: 1,
  code: "HL-CAT1",
  description: "Test Category",
  active: true,
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe("HLPricingForm", () => {
  it("renders correctly with category information", () => {
    renderWithProviders(
      <HLPricingForm category={mockCategory} onSubmit={() => {}} />,
    );

    expect(screen.getByText("Test Category")).toBeDefined();
    expect(screen.getByText("HL-CAT1")).toBeDefined();
    expect(screen.getByText("Update HLC Pricing")).toBeDefined();
    expect(screen.getByRole("button", { name: "Update" })).toBeDefined();
    expect(screen.getByLabelText(/Qty From \(Kg\)/i)).toBeDefined();
    expect(screen.getByLabelText(/Rate \(₹\)/i)).toBeDefined();
    // For date picker, we might need to find by text if label association is weak
    expect(screen.getByText(/Effective From/i)).toBeDefined();
  });

  it("shows default values", () => {
    renderWithProviders(
      <HLPricingForm category={mockCategory} onSubmit={() => {}} />,
    );

    const qtyInput = screen.getByLabelText(
      /Qty From \(Kg\)/i,
    ) as HTMLInputElement;
    const rateInput = screen.getByLabelText(/Rate \(₹\)/i) as HTMLInputElement;
    // Date input in MUI X DatePicker can be found via placeholder or display value if label association is broken
    const dateInput = screen.getByDisplayValue(
      dayjs().format("MM/DD/YYYY"),
    ) as HTMLInputElement;

    expect(qtyInput.value).toBe("0");
    expect(rateInput.value).toBe("0");
    expect(dateInput.value).toBe(dayjs().format("MM/DD/YYYY"));
  });

  it("calls onSubmit with current values when button is clicked", () => {
    const handleSubmit = vi.fn();
    renderWithProviders(
      <HLPricingForm category={mockCategory} onSubmit={handleSubmit} />,
    );

    const qtyInput = screen.getByLabelText(/Qty From \(Kg\)/i);
    const rateInput = screen.getByLabelText(/Rate \(₹\)/i);
    const submitButton = screen.getByRole("button", {
      name: /Update/i,
    });

    fireEvent.change(qtyInput, { target: { value: "10.5" } });
    fireEvent.change(rateInput, { target: { value: "2.5" } });

    fireEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledWith({
      quantityFrom: 10.5,
      rate: 2.5,
      effectiveFrom: dayjs().format("YYYY-MM-DD"),
    });
  });

  it("disables submit button when loading is true", () => {
    renderWithProviders(
      <HLPricingForm
        category={mockCategory}
        onSubmit={() => {}}
        loading={true}
      />,
    );

    const submitButton = screen.getByRole("button", {
      name: /Update/i,
    });
    expect(submitButton).toBeDisabled();
  });

  it("disables submit button when no category is provided", () => {
    renderWithProviders(
      <HLPricingForm category={undefined} onSubmit={() => {}} />,
    );

    const submitButton = screen.getByRole("button", {
      name: /Update/i,
    });
    expect(submitButton).toBeDisabled();
    expect(screen.getByText("Select Category")).toBeDefined();
  });

  it("updates state when inputs change", () => {
    const handleSubmit = vi.fn();
    renderWithProviders(
      <HLPricingForm category={mockCategory} onSubmit={handleSubmit} />,
    );

    const qtyInput = screen.getByLabelText(
      /Qty From \(Kg\)/i,
    ) as HTMLInputElement;
    const rateInput = screen.getByLabelText(/Rate \(₹\)/i) as HTMLInputElement;

    fireEvent.change(qtyInput, { target: { value: "50" } });
    fireEvent.change(rateInput, { target: { value: "5.75" } });

    expect(qtyInput.value).toBe("50");
    expect(rateInput.value).toBe("5.75");
  });
});
