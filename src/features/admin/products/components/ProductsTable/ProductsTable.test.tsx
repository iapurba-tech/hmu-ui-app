import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProductsTable from "./ProductsTable";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../../shared/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Product } from "../../types/product.types";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe("ProductsTable", () => {
  const mockProducts: Product[] = [
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
    {
      id: "2",
      code: "PROD002",
      name: "Notebook",
      category: "STATIONERY",
      uom: "Pcs",
      defaultPrice: 30.0,
      isActive: true,
      isInStock: false,
      description: "A4 size notebook",
    },
  ];

  const mockProps = {
    products: mockProducts,
    isLoading: false,
    onView: vi.fn(),
    onEdit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithTheme = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>{ui}</ThemeProvider>
      </QueryClientProvider>,
    );
  };

  it("renders the table with products", () => {
    renderWithTheme(<ProductsTable {...mockProps} />);
    expect(screen.getByText("Cattle Feed")).toBeDefined();
    expect(screen.getByText("Notebook")).toBeDefined();
    expect(screen.getByText("PROD001")).toBeDefined();
    expect(screen.getByText("PROD002")).toBeDefined();
  });

  it("renders stock status correctly", () => {
    renderWithTheme(<ProductsTable {...mockProps} />);
    expect(screen.getAllByText("In Stock")).toBeDefined();
    expect(screen.getAllByText("Out of Stock")).toBeDefined();
  });

  it("filters products by category", async () => {
    renderWithTheme(<ProductsTable {...mockProps} />);

    // Check both are visible
    expect(screen.getByText("Cattle Feed")).toBeDefined();
    expect(screen.getByText("Notebook")).toBeDefined();

    // Find category filter dropdown
    const select = screen.getAllByRole("combobox")[0]; // Category is first
    fireEvent.mouseDown(select);

    const listbox = within(screen.getByRole("listbox"));
    fireEvent.click(listbox.getByText("Feed"));

    // Only Feed product should be visible
    expect(screen.getByText("Cattle Feed")).toBeDefined();
    expect(screen.queryByText("Notebook")).toBeNull();
  });

  it("filters products by stock status", async () => {
    renderWithTheme(<ProductsTable {...mockProps} />);

    // Find stock status filter dropdown
    const select = screen.getAllByRole("combobox")[1]; // Stock Status is second
    fireEvent.mouseDown(select);

    const listbox = within(screen.getByRole("listbox"));
    fireEvent.click(listbox.getByText("Out of Stock"));

    // Only Notebook (Out of Stock) should be visible
    expect(screen.getByText("Notebook")).toBeDefined();
    expect(screen.queryByText("Cattle Feed")).toBeNull();
  });

  it("calls onView when a row is clicked", () => {
    renderWithTheme(<ProductsTable {...mockProps} />);
    const row = screen.getByText("Cattle Feed").closest("tr");
    if (row) fireEvent.click(row);
    expect(mockProps.onView).toHaveBeenCalledWith(mockProducts[0]);
  });
});
