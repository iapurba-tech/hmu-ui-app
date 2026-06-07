import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProductSaleForm from "./ProductSaleForm";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../shared/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

describe("ProductSaleForm", () => {
  const mockMpcsOptions = [
    { label: "Society A", value: "1" },
    { label: "Society B", value: "2" },
  ];

  const mockProducts = [
    {
      id: "p1",
      name: "Cattle Feed",
      code: "CF01",
      defaultPrice: 1500,
      category: "FEED" as const,
      uom: "BAG",
      isActive: true,
      isInStock: true,
    },
  ];

  const mockOnSubmit = vi.fn();
  const mockOnUpdate = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields", () => {
    const { container } = renderWithProviders(
      <ProductSaleForm
        onSubmit={mockOnSubmit}
        onUpdate={mockOnUpdate}
        initialData={null}
        mpcsOptions={mockMpcsOptions}
        products={mockProducts}
        isSubmitting={false}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.getByText("Record Sale")).toBeDefined();
    expect(container.querySelector('input[name="quantity"]')).toBeDefined();
    expect(container.querySelector('input[name="price"]')).toBeDefined();
  });

  it("auto-populates price when product is selected", async () => {
    const { container } = renderWithProviders(
      <ProductSaleForm
        onSubmit={mockOnSubmit}
        onUpdate={mockOnUpdate}
        initialData={null}
        mpcsOptions={mockMpcsOptions}
        products={mockProducts}
        isSubmitting={false}
        onCancel={mockOnCancel}
      />,
    );

    // Find the product select div (role=combobox) by its aria-labelledby which matches the label id
    const productSelect = container.querySelector('#mui-component-select-productId');
    if (!productSelect) throw new Error("Product select not found");
    
    fireEvent.mouseDown(productSelect);
    const option = await screen.findByText(/Cattle Feed/i);
    fireEvent.click(option);

    // Check Price field value
    const priceInput = container.querySelector('input[name="price"]') as HTMLInputElement;
    expect(priceInput.value).toBe("1500");
  });

  it("calculates net amount correctly", async () => {
    const { container } = renderWithProviders(
      <ProductSaleForm
        onSubmit={mockOnSubmit}
        onUpdate={mockOnUpdate}
        initialData={null}
        mpcsOptions={mockMpcsOptions}
        products={mockProducts}
        isSubmitting={false}
        onCancel={mockOnCancel}
      />,
    );

    const qtyInput = container.querySelector('input[name="quantity"]') as HTMLInputElement;
    const priceInput = container.querySelector('input[name="price"]') as HTMLInputElement;

    fireEvent.change(qtyInput, { target: { value: "2" } });
    fireEvent.change(priceInput, { target: { value: "1500" } });

    // Net Amount should be 3000 in the Bill Summary - use partial match for ₹
    expect(await screen.findByText(/3,000\.00/)).toBeDefined();
  });

  it("adds a record to the draft list", async () => {
    const { container } = renderWithProviders(
      <ProductSaleForm
        onSubmit={mockOnSubmit}
        onUpdate={mockOnUpdate}
        initialData={null}
        mpcsOptions={mockMpcsOptions}
        products={mockProducts}
        isSubmitting={false}
        onCancel={mockOnCancel}
      />,
    );

    // Select MPCS
    const mpcsSelect = container.querySelector('#mui-component-select-mpcsId');
    if (!mpcsSelect) throw new Error("MPCS select not found");
    fireEvent.mouseDown(mpcsSelect);
    fireEvent.click(await screen.findByText(/Society A/i));

    // Select Product
    const productSelect = container.querySelector('#mui-component-select-productId');
    if (!productSelect) throw new Error("Product select not found");
    fireEvent.mouseDown(productSelect);
    fireEvent.click(await screen.findByText(/Cattle Feed/i));

    // Enter Qty
    const qtyInput = container.querySelector('input[name="quantity"]') as HTMLInputElement;
    fireEvent.change(qtyInput, { target: { value: "5" } });
    
    // Click Add Draft
    const addDraftBtn = screen.getByRole("button", { name: /Add Draft/i });
    fireEvent.click(addDraftBtn);

    // Check if it appears in the table
    expect(await screen.findByText("Pending Drafts")).toBeDefined();
    // Qty is "5" - find in the table row
    const tableCells = screen.getAllByRole('cell');
    expect(tableCells.some(cell => cell.textContent === "5")).toBe(true);
  });
});
