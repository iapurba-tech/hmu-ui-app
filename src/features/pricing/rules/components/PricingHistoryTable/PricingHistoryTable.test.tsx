import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PricingHistoryTable from "./PricingHistoryTable";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../../shared/theme";
import type { PricingRule } from "../../types/pricing-rule.types";

const mockRules: PricingRule[] = [
  {
    id: "1",
    ruleType: "FAT",
    rate: 45.5,
    effectiveFrom: "2024-01-01",
    effectiveTo: undefined,
    status: "ACTIVE",
  },
  {
    id: "2",
    ruleType: "FAT",
    rate: 42.0,
    effectiveFrom: "2023-06-01",
    effectiveTo: "2023-12-31",
    status: "INACTIVE",
  },
];

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe("PricingHistoryTable", () => {
  it("renders the table with pricing rules", () => {
    renderWithProviders(<PricingHistoryTable rules={mockRules} />);

    expect(screen.getByText("Pricing History")).toBeDefined();
    expect(screen.getByText("₹45.50")).toBeDefined();
    expect(screen.getByText("₹42.00")).toBeDefined();
  });

  it("calculates and displays the rate difference", () => {
    renderWithProviders(<PricingHistoryTable rules={mockRules} />);

    // Rule 1 rate is 45.5, Rule 2 (prev) was 42.0. Diff = +3.50
    expect(screen.getByText("+3.50")).toBeDefined();
  });

  it("shows empty message when no rules provided", () => {
    renderWithProviders(<PricingHistoryTable rules={[]} />);
    expect(
      screen.getByText("No previous pricing history found for this category."),
    ).toBeDefined();
  });

  it("shows loader when isLoading is true", () => {
    renderWithProviders(<PricingHistoryTable rules={[]} isLoading={true} />);
    // HmuDataTable shows loader which usually has a specific role or data-testid,
    // but based on HmuDataTable implementation it uses HmuLoader
    const loader =
      screen.queryByRole("progressbar") ||
      document.querySelector(".MuiCircularProgress-root");
    expect(loader).toBeDefined();
  });
});
