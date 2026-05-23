import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import BankForm from "./BankForm";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../../shared/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as adminHooks from "../../../../../shared/api/admin/admin.hooks";

// Mock the hooks
vi.mock("../../../../../shared/api/admin/admin.hooks", () => ({
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

describe("BankForm", () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();
  const mockUnits = [
    {
      id: "u1",
      name: "Unit One",
      code: "UNT01",
      active: true,
      address: {} as any,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (adminHooks.useGetUnits as any).mockReturnValue({
      data: mockUnits,
      isLoading: false,
    });

    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  it("renders all form fields in create mode", () => {
    renderWithProviders(
      <BankForm
        mode="create"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.getByText(/Account Identification/i)).toBeDefined();
    expect(screen.getByText(/Bank Details/i)).toBeDefined();
    expect(screen.getByText(/Contact Information/i)).toBeDefined();

    // MUI Select label can be tricky, check for text presence
    expect(screen.getByText(/Select Unit/i)).toBeDefined();
    expect(screen.getByLabelText(/Account Holder Name/i)).toBeDefined();
    expect(screen.getByText(/Account Type/i)).toBeDefined();
    expect(screen.getByLabelText(/Bank Name/i)).toBeDefined();
    expect(screen.getByLabelText(/Account Number/i)).toBeDefined();
    expect(screen.getByLabelText(/IFSC Code/i)).toBeDefined();
    expect(screen.getByLabelText(/Branch Name/i)).toBeDefined();
    expect(screen.getByLabelText(/Contact Number/i)).toBeDefined();
    expect(screen.getByLabelText(/Contact Email/i)).toBeDefined();
  });

  it("shows validation errors for required fields", async () => {
    renderWithProviders(
      <BankForm
        mode="create"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    await waitFor(() => {
      expect(screen.getByText(/Please select a valid unit/i)).toBeDefined();
      expect(screen.getByText(/Bank name is required/i)).toBeDefined();
      expect(
        screen.getByText(/Account number must be at least 10 characters/i),
      ).toBeDefined();
      expect(
        screen.getByText(/Account holder name is required/i),
      ).toBeDefined();
      expect(screen.getByText(/Branch name is required/i)).toBeDefined();
      expect(
        screen.getByText(/Contact number must be 10 digits/i),
      ).toBeDefined();
      expect(screen.getByText(/Invalid email address/i)).toBeDefined();
    });
  });

  it("masks and unmasks account number in view mode", async () => {
    const defaultValues = {
      id: "1",
      unitId: "u1",
      bankName: "State Bank",
      accountNumber: "1234567890",
      accountType: "SAVINGS" as const,
      accountHolderName: "John Doe",
      ifsc: "SBIN0001234",
      branchName: "Main",
      contactNumber: "9876543210",
      contactEmail: "john@example.com",
      unit: { id: "u1", name: "Unit One", code: "UNT01", active: true },
    };

    renderWithProviders(
      <BankForm
        mode="view"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        defaultValues={defaultValues as any}
      />,
    );

    // Should be masked initially
    expect(screen.getByText(/\*+ \d{4}/)).toBeDefined();
    expect(screen.queryByText("1234567890")).toBeNull();

    // Toggle visibility - find eye button (variant-agnostic)
    const eyeButton = screen
      .getAllByRole("button")
      .find((b) => b.querySelector('svg[data-testid*="Visibility"]'));

    if (eyeButton) fireEvent.click(eyeButton);

    expect(screen.getByText("1234567890")).toBeDefined();
  });

  it("calls onCancel when Close button is clicked in view mode", () => {
    renderWithProviders(
      <BankForm mode="view" onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Close/i }));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});
