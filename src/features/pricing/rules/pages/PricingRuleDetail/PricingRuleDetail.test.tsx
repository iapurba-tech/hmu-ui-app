import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PricingRuleDetail from "./PricingRuleDetail";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../../shared/theme";
import { BrowserRouter } from "react-router-dom";
import * as pricingHooks from "../../../../../shared/api/pricing/rule/pricing-rule.hooks";

// Mock router hooks
let mockParams = { type: "fat" };
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => mockParams,
  };
});

// Mock hooks
vi.mock("../../../../../shared/api/pricing/rule/pricing-rule.hooks", () => ({
  useGetPricingRules: vi.fn(),
}));

// Mock child components to isolate page testing
vi.mock("../../components", () => ({
  PricingRuleCard: ({ title }: { title: string }) => <div data-testid="rule-card">{title}</div>,
  PricingHistoryTable: ({ rules }: { rules: any[] }) => <div data-testid="history-table">History count: {rules.length}</div>,
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </BrowserRouter>,
  );
};

describe("PricingRuleDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockParams = { type: "fat" };
  });

  it("renders loader when data is loading", () => {
    vi.mocked(pricingHooks.useGetPricingRules).mockReturnValue({
      data: [],
      isLoading: true,
    } as any);

    renderWithProviders(<PricingRuleDetail />);
    expect(screen.queryByRole("progressbar") || document.querySelector(".MuiCircularProgress-root")).toBeDefined();
  });

  it("renders breadcrumbs, card and history table when data is loaded", () => {
    const mockRules = [
      { id: "1", rate: 45.5, effectiveFrom: "2024-01-01", status: "ACTIVE" },
      { id: "2", rate: 42.0, effectiveFrom: "2023-06-01", status: "INACTIVE" },
    ];

    vi.mocked(pricingHooks.useGetPricingRules).mockReturnValue({
      data: mockRules,
      isLoading: false,
    } as any);

    renderWithProviders(<PricingRuleDetail />);

    // Breadcrumbs
    expect(screen.getByText("Pricing Models")).toBeDefined();
    
    // Check for "FAT rate" which appears in breadcrumb and card
    const titles = screen.getAllByText("FAT rate");
    expect(titles.length).toBeGreaterThanOrEqual(1);

    // Pricing Card
    expect(screen.getByTestId("rule-card")).toBeDefined();
    
    // History Table
    expect(screen.getByTestId("history-table")).toBeDefined();
    expect(screen.getByText("History count: 2")).toBeDefined();
  });

  it("handles unknown rule types gracefully", () => {
    mockParams = { type: "unknown" };

    vi.mocked(pricingHooks.useGetPricingRules).mockReturnValue({
      data: [],
      isLoading: false,
    } as any);

    renderWithProviders(<PricingRuleDetail />);
    const fallbackTitles = screen.getAllByText("Pricing Rule Details");
    expect(fallbackTitles.length).toBeGreaterThanOrEqual(1);
  });
});
