import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProductSalesPage from "./ProductSalesPage";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../shared/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as salesHooks from "../../../../shared/api/unit/sales/product-sales.hooks";
import * as mpcsHooks from "../../../../shared/api/unit/mpcs/mpcs.hooks";
import * as productHooks from "../../../../shared/api/admin/product/product.hooks";

// Mock the hooks
vi.mock("../../../../shared/api/unit/sales/product-sales.hooks", () => ({
  useGetProductSales: vi.fn(),
  useCreateProductSale: vi.fn(),
  useCreateProductSalesBulk: vi.fn(),
  useUpdateProductSale: vi.fn(),
  useDeleteProductSale: vi.fn(),
}));

vi.mock("../../../../shared/api/unit/mpcs/mpcs.hooks", () => ({
  useGetMpcsList: vi.fn(),
}));

vi.mock("../../../../shared/api/admin/product/product.hooks", () => ({
  useGetProducts: vi.fn(),
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

describe("ProductSalesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (salesHooks.useGetProductSales as any).mockReturnValue({
      data: { content: [], totalElements: 0 },
      isLoading: false,
    });
    (mpcsHooks.useGetMpcsList as any).mockReturnValue({
      data: [{ id: "1", name: "Society A" }],
      isLoading: false,
    });
    (productHooks.useGetProducts as any).mockReturnValue({
      data: [{ id: "p1", name: "Cattle Feed", defaultPrice: 1500, code: "CF01" }],
      isLoading: false,
    });
    (salesHooks.useCreateProductSale as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    (salesHooks.useCreateProductSalesBulk as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    (salesHooks.useUpdateProductSale as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    (salesHooks.useDeleteProductSale as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it("renders page title and description", () => {
    renderWithProviders(<ProductSalesPage />);
    expect(screen.getByText("Product Sales")).toBeDefined();
    expect(
      screen.getByText(/Record and manage sales of feed and other products/i),
    ).toBeDefined();
  });

  it("opens and closes the record sale form", async () => {
    renderWithProviders(<ProductSalesPage />);
    
    const recordButton = screen.getByRole("button", { name: /Record Sale/i });
    fireEvent.click(recordButton);

    expect(await screen.findByText("Record Sale", { selector: "h6" })).toBeDefined();

    const closeButton = screen.getByTestId ? screen.getByTestId("CloseIcon") : null;
    if (closeButton) {
        fireEvent.click(closeButton);
    } else {
        // Fallback: find the first button with an icon
        const iconButtons = screen.getAllByRole("button");
        const closeBtn = iconButtons.find(btn => btn.querySelector("svg"));
        if (closeBtn) fireEvent.click(closeBtn);
    }

    await waitFor(() => {
      expect(screen.queryByText("Record Sale", { selector: "h6" })).toBeNull();
    });
  });
});
