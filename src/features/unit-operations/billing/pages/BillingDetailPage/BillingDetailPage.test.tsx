import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import BillingDetailPage from "./BillingDetailPage";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../../shared/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as billingHooks from "../../../../../shared/api/unit/billing/billing.hooks";
import * as mpcsHooks from "../../../../../shared/api/unit/mpcs/mpcs.hooks";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Mock the hooks
vi.mock("../../../../../shared/api/unit/billing/billing.hooks", () => ({
  useGetBillingRun: vi.fn(),
  useGetBillingInvoices: vi.fn(),
  useGetInvoiceDetail: vi.fn(),
}));

vi.mock("../../../../../shared/api/unit/mpcs/mpcs.hooks", () => ({
  useGetMpcsList: vi.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={["/unit/billing/runs/run-1"]}>
          <Routes>
            <Route path="/unit/billing/runs/:runId" element={ui} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>,
  );
};

describe("BillingDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (billingHooks.useGetBillingRun as any).mockReturnValue({
      data: {
        id: "run-1",
        periodStartDate: "2026-06-01",
        periodEndDate: "2026-06-10",
        status: "COMPLETED",
        createdAt: "2026-06-10T10:00:00Z",
      },
      isLoading: false,
    });
    (billingHooks.useGetBillingInvoices as any).mockReturnValue({
      data: [
        {
          id: "inv-1",
          invoiceNumber: "INV-001",
          mpcsId: "m1",
          totalMilkQuantity: 100,
          baseMilkAmount: 4000,
          totalAdditions: 500,
          totalDeductions: 200,
          netPayableAmount: 4300,
          status: "GENERATED",
        },
      ],
      isLoading: false,
    });
    (billingHooks.useGetInvoiceDetail as any).mockReturnValue({
      data: undefined,
      isLoading: false,
    });
    (mpcsHooks.useGetMpcsList as any).mockReturnValue({
      data: [{ id: "m1", name: "Society A" }],
      isLoading: false,
    });
  });

  it("renders run summary and invoices", async () => {
    renderWithProviders(<BillingDetailPage />);
    
    expect(screen.getByText(/Billing Run Details/i)).toBeDefined();
    expect(screen.getByText(/Society A/i)).toBeDefined();
    expect(screen.getByText(/INV-001/i)).toBeDefined();
    expect(screen.getByText(/4,300/i)).toBeDefined(); // Net payable formatted
  });

  it("shows loading state", () => {
    (billingHooks.useGetBillingRun as any).mockReturnValue({
      data: null,
      isLoading: true,
    });

    renderWithProviders(<BillingDetailPage />);
    expect(screen.getByRole("progressbar")).toBeDefined();
  });
});
