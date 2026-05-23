import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import UnitsPage from "./UnitsPage";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../shared/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as adminHooks from "../../../../shared/api/admin/unit/unit.hooks";

// Mock the hook
vi.mock("../../../../shared/api/admin/unit/unit.hooks", () => ({
  useGetUnits: vi.fn(),
  useCreateUnit: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
  useUpdateUnit: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
  useToggleUnitStatus: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithThemeAndRouter = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <MemoryRouter>{ui}</MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe("UnitsPage", () => {
  const mockUnits = [
    {
      id: "1",
      code: "HMU-DHK-042",
      name: "Dhulagarh Chilling Plant",
      address: {
        addressLine1: "Industrial Growth Centre",
        city: "Howrah",
        district: "Howrah",
        state: "West Bengal",
        postalCode: "711302",
      },
      active: true,
    },
    {
      id: "2",
      code: "HMU-BGN-088",
      name: "Bagnan Processing Unit",
      address: {
        addressLine1: "NH-6",
        city: "Bagnan",
        district: "Howrah",
        state: "West Bengal",
        postalCode: "711303",
      },
      active: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page title and subtitle", () => {
    (adminHooks.useGetUnits as any).mockReturnValue({ data: [], isLoading: false });
    renderWithThemeAndRouter(<UnitsPage />);
    expect(screen.getByText("Unit Management")).toBeDefined();
    expect(screen.getByText(/Manage and monitor all organizational units/)).toBeDefined();
  });

  it("renders the units table with data from API", () => {
    (adminHooks.useGetUnits as any).mockReturnValue({ data: mockUnits, isLoading: false });
    renderWithThemeAndRouter(<UnitsPage />);
    
    expect(screen.getByText("Dhulagarh Chilling Plant")).toBeDefined();
    expect(screen.getByText("HMU-DHK-042")).toBeDefined();
    expect(screen.getByText("Industrial Growth Centre, Howrah, 711302")).toBeDefined();
    
    expect(screen.getByText("Bagnan Processing Unit")).toBeDefined();
    expect(screen.getByText("HMU-BGN-088")).toBeDefined();
    expect(screen.getByText("NH-6, Bagnan, 711303")).toBeDefined();
  });

  it("shows loader when data is fetching", () => {
    (adminHooks.useGetUnits as any).mockReturnValue({ data: [], isLoading: true });
    renderWithThemeAndRouter(<UnitsPage />);
    expect(screen.getByRole("progressbar")).toBeDefined();
  });

  it("renders search and filter inputs", () => {
    (adminHooks.useGetUnits as any).mockReturnValue({ data: [], isLoading: false });
    renderWithThemeAndRouter(<UnitsPage />);
    expect(screen.getByPlaceholderText("Search units or codes...")).toBeDefined();
    expect(screen.getByText("All Statuses")).toBeDefined();
  });

  it("opens create modal when clicking Add New Unit button", () => {
    (adminHooks.useGetUnits as any).mockReturnValue({ data: [], isLoading: false });
    renderWithThemeAndRouter(<UnitsPage />);
    
    // Find the button and click it
    const addButton = screen.getByRole("button", { name: /add new unit/i });
    fireEvent.click(addButton);
    
    // Check if modal title is present (it should be in a heading or similar)
    // Using getAllByText because "Add New Unit" is also on the button which might still be in DOM
    const titles = screen.getAllByText("Add New Unit");
    expect(titles.length).toBeGreaterThan(1);
    
    // More specifically, check for the dialog
    expect(screen.getByRole("dialog")).toBeDefined();
  });
});
