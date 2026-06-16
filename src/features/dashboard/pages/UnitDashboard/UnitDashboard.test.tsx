import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UnitDashboard from "./UnitDashboard";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../shared/theme";
import { useAuthStore } from "../../../../shared/store/useAuthStore";
import * as mpcsHooks from "../../../../shared/api/unit/mpcs/mpcs.hooks";
import * as collectionsHooks from "../../../../shared/api/unit/collections/milk-collections.hooks";
import * as salesHooks from "../../../../shared/api/unit/sales/product-sales.hooks";
import * as billingHooks from "../../../../shared/api/unit/billing/billing.hooks";
import * as adviceHooks from "../../../../shared/api/unit/billing/bank-advice.hooks";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock hooks
vi.mock("../../../../shared/hooks/useDocumentTitle", () => ({
  useDocumentTitle: vi.fn(),
}));

vi.mock("../../../../shared/store/useAuthStore", () => ({
  useAuthStore: vi.fn(),
}));

vi.mock("../../../../shared/api/unit/mpcs/mpcs.hooks", () => ({
  useGetMpcsList: vi.fn(),
}));
vi.mock("../../../../shared/api/unit/collections/milk-collections.hooks", () => ({
  useGetMilkCollections: vi.fn(),
}));
vi.mock("../../../../shared/api/unit/sales/product-sales.hooks", () => ({
  useGetProductSales: vi.fn(),
}));
vi.mock("../../../../shared/api/unit/billing/billing.hooks", () => ({
  useGetBillingRuns: vi.fn(),
}));
vi.mock("../../../../shared/api/unit/billing/bank-advice.hooks", () => ({
  useGetBankAdvices: vi.fn(),
}));

// Mock Recharts ResponsiveContainer to prevent width/height warnings in jsdom
vi.mock("recharts", async () => {
  const OriginalRechartsModule = await vi.importActual("recharts");
  return {
    ...OriginalRechartsModule,
    ResponsiveContainer: ({ children }: any) => (
      <div style={{ width: 800, height: 400 }}>{children}</div>
    ),
  };
});

describe("UnitDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();

    vi.mocked(useAuthStore).mockReturnValue({
      activeUnit: { name: "Test Unit", code: "T001", id: "unit-1" },
    } as any);

    (mpcsHooks.useGetMpcsList as any).mockReturnValue({
      data: [{ id: "1", active: true }, { id: "2", active: true }, { id: "3", active: false }],
    });
    (collectionsHooks.useGetMilkCollections as any).mockReturnValue({
      data: { content: [{ quantity: 15000 }, { quantity: 9500 }] },
    });
    (salesHooks.useGetProductSales as any).mockReturnValue({
      data: { content: [{ totalAmount: 50000 }, { totalAmount: 35000 }] },
    });
    (billingHooks.useGetBillingRuns as any).mockReturnValue({
      data: [{ status: "PENDING" }, { status: "COMPLETED" }],
    });
    (adviceHooks.useGetBankAdvices as any).mockReturnValue({
      data: [{ status: "DRAFT" }, { status: "SUBMITTED" }, { status: "COMPLETED" }],
    });
  });

  it("renders the stat cards and metrics based on api data", () => {
    render(
      <ThemeProvider theme={theme}>
        <UnitDashboard />
      </ThemeProvider>
    );

    expect(screen.getByText("Active MPCS")).toBeInTheDocument();
    expect(screen.getByText("2 / 3")).toBeInTheDocument(); // 2 active, 3 total
    
    expect(screen.getByText("Total Collection")).toBeInTheDocument();
    expect(screen.getByText("24.5 Tonnes")).toBeInTheDocument(); // 15000 + 9500 = 24500 kg
    
    expect(screen.getByText("Total Sales")).toBeInTheDocument();
    expect(screen.getByText("₹85.0K")).toBeInTheDocument(); // 50000 + 35000 = 85000
    
    expect(screen.getByText("Billing Action Needed")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument(); // 1 pending run + 2 unprocessed advices (draft/submitted)
    expect(screen.getByText("1 Pending Runs, 2 Advices")).toBeInTheDocument();
  });

  it("navigates when KPI cards are clicked", () => {
    render(
      <ThemeProvider theme={theme}>
        <UnitDashboard />
      </ThemeProvider>
    );

    // Active MPCS
    fireEvent.click(screen.getByText("Active MPCS"));
    expect(mockNavigate).toHaveBeenCalledWith("/unit/mpcs");

    // Total Collection
    fireEvent.click(screen.getByText("Total Collection"));
    expect(mockNavigate).toHaveBeenCalledWith("/unit/procurement/milk-collections");

    // Total Sales
    fireEvent.click(screen.getByText("Total Sales"));
    expect(mockNavigate).toHaveBeenCalledWith("/unit/sales/transactions");

    // Billing Action Needed
    fireEvent.click(screen.getByText("Billing Action Needed"));
    expect(mockNavigate).toHaveBeenCalledWith("/unit/billing/runs");
  });

  it("renders the chart sections", () => {
    render(
      <ThemeProvider theme={theme}>
        <UnitDashboard />
      </ThemeProvider>
    );

    expect(screen.getByText("7-Day Collection Volume")).toBeInTheDocument();
    expect(screen.getByText("Top 10 MPCS")).toBeInTheDocument();
    expect(screen.getByText("Sales Breakdown")).toBeInTheDocument();
    expect(screen.getByText("Quality Trend (7 Days)")).toBeInTheDocument();
  });
});
