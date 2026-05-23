import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import BanksTable from "./BanksTable";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../../shared/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Bank } from "../../types/bank.types";
import * as unitHooks from "../../../../../shared/api/admin/unit/unit.hooks";

// Mock the unit hooks
vi.mock("../../../../../shared/api/admin/unit/unit.hooks", () => ({
  useGetUnits: vi.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe("BanksTable", () => {
  const mockBanks: Bank[] = [
    {
      id: "1",
      code: "BNK001",
      bankName: "State Bank",
      accountNumber: "1234567890",
      accountType: "SAVINGS",
      accountHolderName: "John Doe",
      ifsc: "SBIN0001234",
      branchName: "Main Branch",
      micr: "123456789",
      contactNumber: "9876543210",
      contactEmail: "john@example.com",
      unit: {
        id: "u1",
        code: "UNT01",
        name: "Unit One",
        active: true,
      },
    },
    {
      id: "2",
      code: "BNK002",
      bankName: "ICICI Bank",
      accountNumber: "0987654321",
      accountType: "CURRENT",
      accountHolderName: "Jane Smith",
      ifsc: "ICIC0005678",
      branchName: "Park Street",
      micr: "987654321",
      contactNumber: "9000000000",
      contactEmail: "jane@example.com",
      unit: {
        id: "u2",
        code: "UNT02",
        name: "Unit Two",
        active: false,
      },
    },
  ];

  const mockUnits = [
    { id: "u1", name: "Unit One", code: "UNT01", active: true },
    { id: "u2", name: "Unit Two", code: "UNT02", active: false },
  ];

  const mockProps = {
    banks: mockBanks,
    isLoading: false,
    onView: vi.fn(),
    onEdit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (unitHooks.useGetUnits as any).mockReturnValue({
      data: mockUnits,
      isLoading: false,
    });
  });

  const renderWithTheme = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>{ui}</ThemeProvider>
      </QueryClientProvider>,
    );
  };

  it("renders the table with bank accounts", () => {
    renderWithTheme(<BanksTable {...mockProps} />);
    expect(screen.getByText("John Doe")).toBeDefined();
    expect(screen.getByText("Jane Smith")).toBeDefined();
  });

  it("renders masked account numbers by default", () => {
    renderWithTheme(<BanksTable {...mockProps} />);
    expect(screen.getAllByText(/\*+ \d{4}/)).toHaveLength(2);
  });

  it("toggles account visibility when eye icon is clicked", async () => {
    renderWithTheme(<BanksTable {...mockProps} />);

    const row = screen.getByText("John Doe").closest("tr");
    if (!row) throw new Error("Row not found");

    const toggleButton = row.querySelector("button");
    if (!toggleButton) throw new Error("Toggle button not found");

    fireEvent.click(toggleButton);
    expect(screen.getByText("1234567890")).toBeDefined();

    fireEvent.click(toggleButton);
    expect(screen.queryByText("1234567890")).toBeNull();
  });

  it("filters accounts by unit", async () => {
    renderWithTheme(<BanksTable {...mockProps} />);

    // Check that both accounts are visible initially
    expect(screen.getByText("John Doe")).toBeDefined();
    expect(screen.getByText("Jane Smith")).toBeDefined();

    // Find the filter dropdown
    // HmuDataTable renders filters with MenuItem. The Select has the current value.
    const select = screen.getByRole("combobox");
    fireEvent.mouseDown(select);

    // Find and click "Unit One" in the listbox
    const listbox = within(screen.getByRole("listbox"));
    fireEvent.click(listbox.getByText("Unit One"));

    // Now only John Doe should be visible
    expect(screen.getByText("John Doe")).toBeDefined();
    expect(screen.queryByText("Jane Smith")).toBeNull();

    // Switch to "All Units"
    fireEvent.mouseDown(select);
    fireEvent.click(listbox.getByText("All Units"));

    // Both should be visible again
    expect(screen.getByText("John Doe")).toBeDefined();
    expect(screen.getByText("Jane Smith")).toBeDefined();
  });

  it("calls onView when a row is clicked", () => {
    renderWithTheme(<BanksTable {...mockProps} />);
    const row = screen.getByText("John Doe").closest("tr");
    if (row) fireEvent.click(row);
    expect(mockProps.onView).toHaveBeenCalledWith(mockBanks[0]);
  });
});
