import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MilkCollectionsPage from "./MilkCollectionsPage";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../shared/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as milkHooks from "../../../../shared/api/unit/milk-collections/milk-collections.hooks";
import * as mpcsHooks from "../../../../shared/api/unit/mpcs/mpcs.hooks";

// Mock the hooks
vi.mock("../../../../shared/api/unit/milk-collections/milk-collections.hooks", () => ({
  useGetMilkCollections: vi.fn(),
  useCreateMilkCollection: vi.fn(),
  useCreateMilkCollectionsBulk: vi.fn(),
  useUpdateMilkCollection: vi.fn(),
  useDeleteMilkCollection: vi.fn(),
}));

vi.mock("../../../../shared/api/unit/mpcs/mpcs.hooks", () => ({
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
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </QueryClientProvider>,
  );
};

describe("MilkCollectionsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (milkHooks.useGetMilkCollections as any).mockReturnValue({
      data: { content: [], totalElements: 0 },
      isLoading: false,
    });
    (mpcsHooks.useGetMpcsList as any).mockReturnValue({
      data: [{ id: "1", name: "Society A" }],
      isLoading: false,
    });
    (milkHooks.useCreateMilkCollection as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    (milkHooks.useCreateMilkCollectionsBulk as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    (milkHooks.useUpdateMilkCollection as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    (milkHooks.useDeleteMilkCollection as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it("renders page title and description", () => {
    renderWithProviders(<MilkCollectionsPage />);
    expect(screen.getAllByText(/Milk Collections/i)[0]).toBeDefined();
    expect(
      screen.getByText(/Manage and record milk collections/i),
    ).toBeDefined();
  });

  it("renders the form and the table", async () => {
    renderWithProviders(<MilkCollectionsPage />);
    
    // Open form
    const addButton = screen.getByRole("button", { name: /Add Collection/i });
    fireEvent.click(addButton);

    expect(await screen.findByText(/Record Collection/i)).toBeDefined();
    expect(screen.getByText(/No milk collections found/i)).toBeDefined();
  });

  it("renders the action buttons", async () => {
    renderWithProviders(<MilkCollectionsPage />);
    
    // Open form
    const addButton = screen.getByRole("button", { name: /Add Collection/i });
    fireEvent.click(addButton);

    expect(await screen.findByText(/Add Draft/i)).toBeDefined();
    expect(screen.getByText(/^Save$/)).toBeDefined();
  });
});
