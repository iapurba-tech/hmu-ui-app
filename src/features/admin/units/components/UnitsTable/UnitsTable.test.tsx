import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import UnitsTable from "./UnitsTable";
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

describe("UnitsTable", () => {
  const mockUnits = [
    {
      id: "1",
      code: "U001",
      name: "Unit One",
      address: {
        addressLine1: "Address 1",
        city: "City 1",
        district: "District 1",
        state: "State 1",
        postalCode: "123",
      },
      active: true,
    },
    {
      id: "2",
      code: "U002",
      name: "Unit Two",
      address: {
        addressLine1: "Address 2",
        city: "City 2",
        district: "District 2",
        state: "State 2",
        postalCode: "456",
      },
      active: false,
    },
  ];

  const mockProps = {
    units: mockUnits,
    isLoading: false,
    onView: vi.fn(),
    onEdit: vi.fn(),
  };

  const renderWithTheme = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          {ui}
        </ThemeProvider>
      </QueryClientProvider>
    );
  };

  it("renders the table with units", () => {
    renderWithTheme(<UnitsTable {...mockProps} />);
    expect(screen.getByText("Unit One")).toBeDefined();
    expect(screen.getByText("Unit Two")).toBeDefined();
  });

  it("filters units by search term", () => {
    renderWithTheme(<UnitsTable {...mockProps} />);
    const searchInput = screen.getByPlaceholderText("Search units or codes...");
    
    fireEvent.change(searchInput, { target: { value: "One" } });
    
    expect(screen.getByText("Unit One")).toBeDefined();
    expect(screen.queryByText("Unit Two")).toBeNull();
  });

  it("calls onView when a row is clicked", () => {
    renderWithTheme(<UnitsTable {...mockProps} />);
    const row = screen.getByText("Unit One").closest("tr");
    if (row) fireEvent.click(row);
    expect(mockProps.onView).toHaveBeenCalledWith(mockUnits[0]);
  });
});
