import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HeadLoadActivePricesTable from "./HLActivePricingTable";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../../shared/theme";
import type { HeadLoadPrice } from "../../types/head-load-price.types";
import type { HeadLoadCategory } from "../../types/head-load-category.types";

const mockCategories: HeadLoadCategory[] = [
  { id: 1, code: "HL-CAT1", description: "Category 1", active: true },
  { id: 2, code: "HL-CAT2", description: "Category 2", active: true },
];

const mockPrices: HeadLoadPrice[] = [
  {
    id: "1",
    headLoadCategoryId: 1,
    quantityFrom: 0,
    rate: 1.5,
    effectiveFrom: "2024-01-01",
    effectiveTo: null,
    status: "ACTIVE",
  },
  {
    id: "2",
    headLoadCategoryId: 1,
    quantityFrom: 10,
    rate: 2.0,
    effectiveFrom: "2024-01-01",
    effectiveTo: null,
    status: "ACTIVE",
  },
  {
    id: "3",
    headLoadCategoryId: 2,
    quantityFrom: 0,
    rate: 1.8,
    effectiveFrom: "2024-01-01",
    effectiveTo: null,
    status: "ACTIVE",
  },
  {
    id: "4",
    headLoadCategoryId: 1,
    quantityFrom: 0,
    rate: 1.2,
    effectiveFrom: "2023-01-01",
    effectiveTo: "2023-12-31",
    status: "INACTIVE",
  },
];

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe("HeadLoadActivePricesTable", () => {
  it("renders loading state correctly", () => {
    renderWithProviders(
      <HeadLoadActivePricesTable
        prices={[]}
        categories={[]}
        isLoading={true}
      />,
    );
    expect(screen.getByRole("progressbar")).toBeDefined();
  });

  it("renders empty state correctly", () => {
    renderWithProviders(
      <HeadLoadActivePricesTable
        prices={[]}
        categories={[]}
        isLoading={false}
      />,
    );
    expect(screen.getByText("No active price ranges found.")).toBeDefined();
  });

  it("renders active price ranges grouped by category", () => {
    renderWithProviders(
      <HeadLoadActivePricesTable
        prices={mockPrices}
        categories={mockCategories}
        isLoading={false}
      />,
    );

    // Check category headers
    expect(screen.getByText("Category 1 (HL-CAT1)")).toBeDefined();
    expect(screen.getByText("Category 2 (HL-CAT2)")).toBeDefined();
    expect(screen.getByText("Active HLC Pricing")).toBeDefined();

    // Check active prices using within to be specific about table rows
    const rows = screen.getAllByRole("row");

    // Row 0 is header
    // Row 1 is Category 1 header
    // Row 2 is Range 1 for Cat 1 (0.000 Kg, ₹1.50)
    // Row 3 is Range 2 for Cat 1 (10.000 Kg, ₹2.00)
    // Row 4 is Category 2 header
    // Row 5 is Range 1 for Cat 2 (0.000 Kg, ₹1.80)

    expect(within(rows[2]).getByText(/0\.000\s+Kg/)).toBeDefined();
    expect(within(rows[2]).getByText("₹1.50")).toBeDefined();

    expect(within(rows[3]).getByText(/10\.000\s+Kg/)).toBeDefined();
    expect(within(rows[3]).getByText("₹2.00")).toBeDefined();

    expect(within(rows[5]).getByText(/0\.000\s+Kg/)).toBeDefined();
    expect(within(rows[5]).getByText("₹1.80")).toBeDefined();

    // Inactive price rate should not be present in any row
    const inactiveRate = screen.queryByText("₹1.20");
    expect(inactiveRate).toBeNull();
  });

  it("sorts categories alphabetically and price ranges by quantity", () => {
    renderWithProviders(
      <HeadLoadActivePricesTable
        prices={mockPrices}
        categories={mockCategories}
        isLoading={false}
      />,
    );

    const rows = screen.getAllByRole("row");
    // Verify first category is "Category 1"
    expect(within(rows[1]).getByText(/Category 1/)).toBeDefined();
    // Verify first range of first category is the one with 0 Kg
    expect(within(rows[2]).getByText(/0\.000\s+Kg/)).toBeDefined();
    // Verify second range of first category is the one with 10 Kg
    expect(within(rows[3]).getByText(/10\.000\s+Kg/)).toBeDefined();
  });
});
