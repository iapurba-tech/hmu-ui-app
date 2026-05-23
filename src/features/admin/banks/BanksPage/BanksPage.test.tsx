import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import BanksPage from "./BanksPage";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../shared/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as bankHooks from "../../../../shared/api/admin/bank/bank.hooks";
import * as unitHooks from "../../../../shared/api/admin/unit/unit.hooks";

// Mock the hooks
vi.mock("../../../../shared/api/admin/bank/bank.hooks", () => ({
  useGetBankAccounts: vi.fn(),
  useCreateBankAccount: vi.fn(),
  useUpdateBankAccount: vi.fn(),
  useDeleteBankAccount: vi.fn(),
}));

vi.mock("../../../../shared/api/admin/unit/unit.hooks", () => ({
  useGetUnits: vi.fn(),
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

describe("BanksPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (bankHooks.useGetBankAccounts as any).mockReturnValue({
      data: [],
      isLoading: false,
    });
    (unitHooks.useGetUnits as any).mockReturnValue({
      data: [],
      isLoading: false,
    });
    (bankHooks.useCreateBankAccount as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    (bankHooks.useUpdateBankAccount as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    (bankHooks.useDeleteBankAccount as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it("renders page title and description", () => {
    renderWithProviders(<BanksPage />);
    expect(screen.getByText(/Bank Management/i)).toBeDefined();
    expect(
      screen.getByText(/Manage bank accounts associated with various units/i),
    ).toBeDefined();
  });

  it("opens modal when Add Bank Account button is clicked", () => {
    renderWithProviders(<BanksPage />);
    const addButton = screen.getByRole("button", { name: /Add Bank Account/i });
    fireEvent.click(addButton);

    expect(screen.getByText(/Add New Bank Account/i)).toBeDefined();
  });

  it("shows loader when data is loading", () => {
    (bankHooks.useGetBankAccounts as any).mockReturnValue({
      data: [],
      isLoading: true,
    });
    renderWithProviders(<BanksPage />);
    // HmuDataTable should show a loader or empty state with loading prop
    // Assuming it shows some loading indicator
    expect(screen.getByRole("progressbar")).toBeDefined();
  });
});
