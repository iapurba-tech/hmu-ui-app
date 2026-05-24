import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProductForm from "./ProductForm";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../../shared/theme";
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

describe("ProductForm", () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields in create mode", () => {
    renderWithProviders(
      <ProductForm
        mode="create"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.getByText(/Product Information/i)).toBeDefined();
    expect(screen.getByLabelText(/Product Name/i)).toBeDefined();
    expect(screen.getByText(/Category/i)).toBeDefined();
    expect(screen.getByLabelText(/Measuring Unit/i)).toBeDefined();
    expect(screen.getByLabelText(/MRP/i)).toBeDefined();
    expect(screen.getByText(/In Stock/i)).toBeDefined();
    expect(screen.getByLabelText(/Description/i)).toBeDefined();
  });

  it("shows validation errors for required fields", async () => {
    renderWithProviders(
      <ProductForm
        mode="create"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Create Product/i }));

    await waitFor(() => {
      expect(screen.getByText(/Product name is required/i)).toBeDefined();
      expect(screen.getByText(/UOM is required/i)).toBeDefined();
      expect(screen.getByText(/Price must be at least 0.01/i)).toBeDefined();
    });
  });

  it("submits the form with valid data", async () => {
    renderWithProviders(
      <ProductForm
        mode="create"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />,
    );

    fireEvent.change(screen.getByLabelText(/Product Name/i), {
      target: { value: "New Product" },
    });
    fireEvent.change(screen.getByLabelText(/Measuring Unit/i), {
      target: { value: "KG" },
    });
    fireEvent.change(screen.getByLabelText(/MRP/i), {
      target: { value: "100" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create Product/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "New Product",
          uom: "KG",
          defaultPrice: 100,
        }),
      );
    });
  });

  it("renders in view mode correctly", () => {
    const defaultValues = {
      id: "1",
      code: "PROD001",
      name: "Cattle Feed",
      category: "FEED" as const,
      uom: "KG",
      defaultPrice: 50.5,
      isActive: true,
      isInStock: true,
      description: "Standard cattle feed",
    };

    renderWithProviders(
      <ProductForm
        mode="view"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        defaultValues={defaultValues}
      />,
    );

    expect(screen.getByText("Cattle Feed")).toBeDefined();
    expect(screen.getByText("PROD001")).toBeDefined();
    expect(screen.getByText("FEED")).toBeDefined();
    expect(screen.getByText("KG")).toBeDefined();
    expect(screen.getByText("₹50.50")).toBeDefined();
    expect(screen.getByText("Yes")).toBeDefined(); // In Stock
  });

  it("calls onCancel when Cancel/Close button is clicked", () => {
    renderWithProviders(
      <ProductForm mode="create" onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});
