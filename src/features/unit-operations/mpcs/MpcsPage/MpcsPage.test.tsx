import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MpcsPage from "./MpcsPage";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../shared/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as mpcsHooks from "../../../../shared/api/unit/mpcs/mpcs.hooks";
import * as unitHooks from "../../../../shared/api/admin/unit/unit.hooks";
import * as bankHooks from "../../../../shared/api/admin/bank/bank.hooks";
import * as headLoadHooks from "../../../../shared/api/pricing/head-load/head-load-category.hooks";

// Mock the hooks
vi.mock("../../../../shared/api/unit/mpcs/mpcs.hooks", () => ({
  useGetMpcsList: vi.fn(),
  useCreateMpcs: vi.fn(),
  useUpdateMpcsDetails: vi.fn(),
  useUpdateMpcsConfiguration: vi.fn(),
  useDeleteMpcs: vi.fn(),
}));

vi.mock("../../../../shared/api/admin/unit/unit.hooks", () => ({
  useGetUnits: vi.fn(),
}));

vi.mock("../../../../shared/api/admin/bank/bank.hooks", () => ({
  useGetBankAccounts: vi.fn(),
}));

vi.mock(
  "../../../../shared/api/pricing/head-load/head-load-category.hooks",
  () => ({
    useGetHeadLoadCategories: vi.fn(),
  }),
);

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

describe("MpcsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (mpcsHooks.useGetMpcsList as any).mockReturnValue({
      data: [],
      isLoading: false,
    });
    (unitHooks.useGetUnits as any).mockReturnValue({
      data: [],
      isLoading: false,
    });
    (bankHooks.useGetBankAccounts as any).mockReturnValue({
      data: [],
      isLoading: false,
    });
    (headLoadHooks.useGetHeadLoadCategories as any).mockReturnValue({
      data: [],
      isLoading: false,
    });
    (mpcsHooks.useCreateMpcs as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    (mpcsHooks.useUpdateMpcsDetails as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    (mpcsHooks.useUpdateMpcsConfiguration as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    (mpcsHooks.useDeleteMpcs as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it("renders page title and description", () => {
    renderWithProviders(<MpcsPage />);
    expect(screen.getByText(/MPCS Management/i)).toBeDefined();
    expect(
      screen.getByText(/Manage Milk Producers Cooperative Societies/i),
    ).toBeDefined();
  });

  it("opens modal when Add MPCS button is clicked", () => {
    renderWithProviders(<MpcsPage />);
    const addButton = screen.getByRole("button", { name: /Add MPCS/i });
    fireEvent.click(addButton);

    expect(screen.getByText(/Add New MPCS/i)).toBeDefined();
  });

  it("shows loader when data is loading", () => {
    (mpcsHooks.useGetMpcsList as any).mockReturnValue({
      data: [],
      isLoading: true,
    });
    renderWithProviders(<MpcsPage />);
    expect(screen.getByRole("progressbar")).toBeDefined();
  });
});
