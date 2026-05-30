import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PricingSummary from "./PricingSummary";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../../shared/theme";
import { BrowserRouter } from "react-router-dom";

// Mock child component as it has its own tests and side effects (API calls)
vi.mock("../../components/PricingRuleCard/PricingRuleCard", () => ({
  default: ({ title }: { title: string }) => <div data-testid="rule-card">{title}</div>,
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </BrowserRouter>,
  );
};

describe("PricingSummary", () => {
  it("renders the header and subtitle", () => {
    renderWithProviders(<PricingSummary />);
    
    expect(screen.getByText("Pricing Models")).toBeDefined();
    expect(screen.getByText(/Configure and manage global pricing rules/i)).toBeDefined();
  });

  it("renders all defined pricing rule cards", () => {
    renderWithProviders(<PricingSummary />);
    
    const cards = screen.getAllByTestId("rule-card");
    expect(cards).toHaveLength(5);
    
    expect(screen.getByText("FAT rate")).toBeDefined();
    expect(screen.getByText("SNF rate")).toBeDefined();
    expect(screen.getByText("Society Commission")).toBeDefined();
    expect(screen.getByText("Procurement Incentive")).toBeDefined();
    expect(screen.getByText("Managerial Subsidy")).toBeDefined();
  });
});
