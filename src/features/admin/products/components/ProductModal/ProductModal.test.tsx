import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProductModal from "./ProductModal";
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

describe("ProductModal", () => {
  const mockOnSubmit = vi.fn();
  const mockOnClose = vi.fn();

  it("renders with correct title for create mode", () => {
    renderWithProviders(
      <ProductModal
        open={true}
        onClose={mockOnClose}
        mode="create"
        onSubmit={mockOnSubmit}
      />,
    );
    expect(screen.getByText(/Add New Product/i)).toBeDefined();
  });

  it("renders with correct title for edit mode", () => {
    renderWithProviders(
      <ProductModal
        open={true}
        onClose={mockOnClose}
        mode="edit"
        onSubmit={mockOnSubmit}
        product={{ id: "1", name: "Test" } as any}
      />,
    );
    expect(screen.getByText(/Edit Product/i)).toBeDefined();
  });

  it("renders with correct title for view mode", () => {
    renderWithProviders(
      <ProductModal
        open={true}
        onClose={mockOnClose}
        mode="view"
        onSubmit={mockOnSubmit}
        product={{ id: "1", name: "Test" } as any}
      />,
    );
    expect(screen.getByText(/Product Details/i)).toBeDefined();
  });

  it("calls onClose when close icon is clicked", () => {
    renderWithProviders(
      <ProductModal
        open={true}
        onClose={mockOnClose}
        mode="create"
        onSubmit={mockOnSubmit}
      />,
    );
    fireEvent.click(screen.getByLabelText(/close/i));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
