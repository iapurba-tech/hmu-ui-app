import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ProductsPage from "./ProductsPage";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../shared/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as productHooks from "../../../../shared/api/admin/product/product.hooks";

// Mock the hooks
vi.mock("../../../../shared/api/admin/product/product.hooks", () => ({
  useGetProducts: vi.fn(),
  useCreateProduct: vi.fn(),
  useUpdateProduct: vi.fn(),
  useDeleteProduct: vi.fn(),
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
      <MemoryRouter>
        <ThemeProvider theme={theme}>{ui}</ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("ProductsPage", () => {
  const mockProducts = [
    {
      id: "1",
      code: "PROD001",
      name: "Cattle Feed",
      category: "FEED",
      uom: "KG",
      defaultPrice: 50.5,
      isActive: true,
      isInStock: true,
      description: "Standard cattle feed",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (productHooks.useGetProducts as any).mockReturnValue({
      data: mockProducts,
      isLoading: false,
    });
    (productHooks.useCreateProduct as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    (productHooks.useUpdateProduct as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    (productHooks.useDeleteProduct as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it("renders page title and product list", () => {
    renderWithProviders(<ProductsPage />);
    expect(screen.getByText(/Product Management/i)).toBeDefined();
    expect(screen.getByText("Cattle Feed")).toBeDefined();
    expect(screen.getByText("PROD001")).toBeDefined();
    expect(screen.getAllByText(/In Stock/i)).toBeDefined();
  });

  it("opens modal when Add Product button is clicked", () => {
    renderWithProviders(<ProductsPage />);
    const addButton = screen.getByRole("button", { name: /Add Product/i });
    fireEvent.click(addButton);

    expect(screen.getByText(/Add New Product/i)).toBeDefined();
  });

  it("shows loader when data is loading", () => {
    (productHooks.useGetProducts as any).mockReturnValue({
      data: [],
      isLoading: true,
    });
    renderWithProviders(<ProductsPage />);
    expect(screen.getByRole("progressbar")).toBeDefined();
  });
});
