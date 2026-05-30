import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HeadLoadPricingHistoryTable from "./HLPricingHistoryTable";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../../shared/theme";
import type { HeadLoadPrice } from "../../types/head-load-price.types";

const mockPrices: HeadLoadPrice[] = [
  {
    id: "1",
    headLoadCategoryId: 1,
    quantityFrom: 10.5,
    rate: 1.5,
    effectiveFrom: "2024-01-01",
    effectiveTo: null,
    status: "ACTIVE",
  },
  {
    id: "2",
    headLoadCategoryId: 1,
    quantityFrom: 5.0,
    rate: 1.2,
    effectiveFrom: "2023-01-01",
    effectiveTo: "2023-12-31",
    status: "INACTIVE",
  },
];

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe("HeadLoadPricingHistoryTable", () => {
  it("renders the table with pricing data", () => {
    renderWithProviders(<HeadLoadPricingHistoryTable prices={mockPrices} />);

    expect(screen.getByText("Pricing History")).toBeDefined();
    expect(screen.getByText("10.500")).toBeDefined();
    expect(screen.getByText("5.000")).toBeDefined();
    expect(screen.getByText("₹1.50")).toBeDefined();
    expect(screen.getByText("₹1.20")).toBeDefined();
  });

  it("shows empty message when no prices provided", () => {
    renderWithProviders(<HeadLoadPricingHistoryTable prices={[]} />);
    expect(
      screen.getByText("No price ranges found for this category."),
    ).toBeDefined();
  });

  it("renders status badges correctly", () => {
    renderWithProviders(<HeadLoadPricingHistoryTable prices={mockPrices} />);
    expect(screen.getByText("ACTIVE")).toBeDefined();
    expect(screen.getByText("INACTIVE")).toBeDefined();
  });
});
