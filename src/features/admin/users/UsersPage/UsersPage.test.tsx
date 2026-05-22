import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import UsersPage from "./UsersPage";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../shared/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as adminHooks from "../../../../shared/api/admin/admin.hooks";
import { UserRole } from "../../../auth/constants/roles";

// Mock the hooks
vi.mock("../../../../shared/api/admin/admin.hooks", () => ({
  useGetUsers: vi.fn(),
  useGetUnits: vi.fn(() => ({ data: [], isLoading: false })),
  useCreateUser: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
  useUpdateUser: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
  useToggleUserStatus: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
  useDeleteUserPermanent: vi.fn(() => ({
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
    </QueryClientProvider>,
  );
};

describe("UsersPage", () => {
  const mockUsers = [
    {
      id: "1",
      firstname: "Apurba",
      lastname: "Panja",
      username: "iapurba.admin",
      email: "iapurba.admin@hmu.org",
      role: UserRole.SYSTEM_ADMIN,
      active: true,
      units: [],
      address: {
        addressLine1: "Block D, Bharat Co-operative",
        city: "Sankrail",
        district: "Howrah",
        state: "WB",
        postalCode: "711313",
      },
    },
    {
      id: "2",
      firstname: "John",
      lastname: "Doe",
      username: "johndoe",
      email: "john.doe@example.com",
      role: UserRole.UNIT_ADMIN,
      active: true,
      units: [{ id: "u1", name: "Amta Unit" }],
      address: {
        addressLine1: "Unit Road",
        city: "Amta",
        district: "Howrah",
        state: "WB",
        postalCode: "711401",
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page title and subtitle", () => {
    (adminHooks.useGetUsers as any).mockReturnValue({
      data: [],
      isLoading: false,
    });
    renderWithThemeAndRouter(<UsersPage />);
    expect(screen.getByText("User Management")).toBeDefined();
    expect(screen.getByText(/Manage and monitor system users/)).toBeDefined();
  });

  it("renders the users table with data from API", () => {
    (adminHooks.useGetUsers as any).mockReturnValue({
      data: mockUsers,
      isLoading: false,
    });
    renderWithThemeAndRouter(<UsersPage />);

    expect(screen.getByText("Apurba Panja")).toBeDefined();
    expect(screen.getByText("iapurba.admin")).toBeDefined();
    expect(screen.getByText("iapurba.admin@hmu.org")).toBeDefined();

    expect(screen.getByText("John Doe")).toBeDefined();
    expect(screen.getByText("johndoe")).toBeDefined();
    expect(screen.getByText("john.doe@example.com")).toBeDefined();
  });

  it("shows loader when data is fetching", () => {
    (adminHooks.useGetUsers as any).mockReturnValue({
      data: [],
      isLoading: true,
    });
    renderWithThemeAndRouter(<UsersPage />);
    expect(screen.getByRole("progressbar")).toBeDefined();
  });

  it("renders search and filter inputs", () => {
    (adminHooks.useGetUsers as any).mockReturnValue({
      data: [],
      isLoading: false,
    });
    renderWithThemeAndRouter(<UsersPage />);
    expect(
      screen.getByPlaceholderText("Search users, email, or username..."),
    ).toBeDefined();
    expect(screen.getByText("All Statuses")).toBeDefined();
  });

  it("opens create modal when clicking Add New User button", () => {
    (adminHooks.useGetUsers as any).mockReturnValue({
      data: [],
      isLoading: false,
    });
    renderWithThemeAndRouter(<UsersPage />);

    const addButton = screen.getByRole("button", { name: /add new user/i });
    fireEvent.click(addButton);

    const titles = screen.getAllByText("Add New User");
    expect(titles.length).toBeGreaterThan(1);

    expect(screen.getByRole("dialog")).toBeDefined();
  });
});
