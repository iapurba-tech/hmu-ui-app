import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import BillingPage from "./BillingPage";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../../shared/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as billingHooks from "../../../../../shared/api/unit/billing/billing.hooks";

// Mock the hooks
vi.mock("../../../../../shared/api/unit/billing/billing.hooks", () => ({
  useGetBillingRuns: vi.fn(),
  useCreateBillingRun: vi.fn(),
  useDeleteBillingRun: vi.fn(),
  useGetBillingInvoices: vi.fn(),
  useGetInvoiceDetail: vi.fn(),
}));

vi.mock("../../../../../shared/api/unit/mpcs/mpcs.hooks", () => ({
  useGetMpcsList: vi.fn(),
}));

// Mock useAuthStore
vi.mock("../../../../../shared/store/useAuthStore", () => ({
  useAuthStore: vi.fn(() => ({
    activeUnit: { id: "unit-1", name: "Unit 1" },
  })),
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
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </QueryClientProvider>,
  );
};

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("BillingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    (billingHooks.useGetBillingRuns as any).mockReturnValue({
      data: [],
      isLoading: false,
    });
    (billingHooks.useGetBillingInvoices as any).mockReturnValue({
      data: [],
      isLoading: false,
    });
    (billingHooks.useGetInvoiceDetail as any).mockReturnValue({
      data: undefined,
      isLoading: false,
    });
    (billingHooks.useCreateBillingRun as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    (billingHooks.useDeleteBillingRun as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it("renders page title and description", () => {
    renderWithProviders(<BillingPage />);
    expect(screen.getByRole("heading", { name: /Billing Runs/i, level: 5 })).toBeDefined();
    expect(
      screen.getByText(/Generate and manage billing runs for your unit/i),
    ).toBeDefined();
  });

  it("renders side-by-side layout with form and table", () => {
    renderWithProviders(<BillingPage />);
    expect(screen.getByText(/Generate New Bill/i)).toBeDefined();
    expect(screen.getByText(/Previous Runs/i)).toBeDefined();
  });

  it("navigates to detail page when a run is clicked", async () => {
    (billingHooks.useGetBillingRuns as any).mockReturnValue({
      data: [{ id: "run-1", periodStartDate: "2026-06-01", periodEndDate: "2026-06-10", status: "COMPLETED" }],
      isLoading: false,
    });

    renderWithProviders(<BillingPage />);
    
    const viewButton = screen.getByLabelText("view-invoices");
    fireEvent.click(viewButton);

    expect(mockNavigate).toHaveBeenCalledWith("/unit/billing/runs/run-1");
  });
});
