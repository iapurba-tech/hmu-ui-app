import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import BankAdvicePage from "./BankAdvicePage";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../../shared/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as bankAdviceHooks from "../../../../../shared/api/unit/billing/bank-advice.hooks";
import * as billingHooks from "../../../../../shared/api/unit/billing/billing.hooks";
import * as bankHooks from "../../../../../shared/api/admin/bank/bank.hooks";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../../../../shared/api/unit/billing/bank-advice.hooks", () => ({
  useGetBankAdvices: vi.fn(),
  useCreateBankAdvice: vi.fn(),
  useDeleteBankAdvice: vi.fn(),
  useSubmitBankAdvice: vi.fn(),
  useProcessBankAdvice: vi.fn(),
}));

vi.mock("../../../../../shared/api/unit/billing/billing.hooks", () => ({
  useGetBillingRuns: vi.fn(),
  useGetBillingInvoices: vi.fn(),
  useGetInvoiceDetail: vi.fn(),
  useCreateBillingRun: vi.fn(),
  useDeleteBillingRun: vi.fn(),
}));

vi.mock("../../../../../shared/api/admin/bank/bank.hooks", () => ({
  useGetBankAccounts: vi.fn(),
}));

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

describe("BankAdvicePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();

    (bankAdviceHooks.useGetBankAdvices as any).mockReturnValue({
      data: [],
      isLoading: false,
    });
    (bankAdviceHooks.useCreateBankAdvice as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    (bankAdviceHooks.useDeleteBankAdvice as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    (bankAdviceHooks.useSubmitBankAdvice as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    (bankAdviceHooks.useProcessBankAdvice as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });

    (billingHooks.useGetBillingRuns as any).mockReturnValue({
      data: [],
      isLoading: false,
    });
    (bankHooks.useGetBankAccounts as any).mockReturnValue({
      data: [],
      isLoading: false,
    });
  });

  it("renders page title and description", () => {
    renderWithProviders(<BankAdvicePage />);
    expect(
      screen.getByRole("heading", { name: /Bank Advice/i, level: 5 }),
    ).toBeDefined();
    expect(
      screen.getByText(
        /Generate and manage bank advice for completed billing runs/i,
      ),
    ).toBeDefined();
  });

  it("renders side-by-side layout with form and table", () => {
    renderWithProviders(<BankAdvicePage />);
    expect(screen.getByText(/Pending Generation/i)).toBeDefined();
    expect(screen.getAllByText(/Bank Advice/i).length).toBeGreaterThan(0);
  });
});
