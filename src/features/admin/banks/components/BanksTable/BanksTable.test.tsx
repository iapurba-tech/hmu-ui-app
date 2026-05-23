import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BanksTable from "./BanksTable";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../../shared/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Bank } from "../../types/bank.types";

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

  const mockProps = {
    banks: mockBanks,
    isLoading: false,
    onView: vi.fn(),
    onEdit: vi.fn(),
  };

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
    // Check for masked format
    expect(screen.getAllByText(/\*+ \d{4}/)).toHaveLength(2);
  });

  it("toggles account visibility when eye icon is clicked", async () => {
    renderWithTheme(<BanksTable {...mockProps} />);

    // Find the row for John Doe
    const row = screen.getByText("John Doe").closest("tr");
    if (!row) throw new Error("Row not found");

    // Find the toggle button in that row
    const toggleButton = row.querySelector("button"); // First button in row is visibility toggle
    if (!toggleButton) throw new Error("Toggle button not found");

    fireEvent.click(toggleButton);

    // Check if the number is visible
    expect(screen.getByText("1234567890")).toBeDefined();

    // Click again to mask
    fireEvent.click(toggleButton);
    expect(screen.queryByText("1234567890")).toBeNull();
  });

  it("calls onView when a row is clicked", () => {
    renderWithTheme(<BanksTable {...mockProps} />);
    const row = screen.getByText("John Doe").closest("tr");
    if (row) fireEvent.click(row);
    expect(mockProps.onView).toHaveBeenCalledWith(mockBanks[0]);
  });
});
