import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import WorkspaceModal from "./WorkspaceModal";
import { ThemeProvider, createTheme } from "@mui/material";
import { UserRole } from "../../constants/roles";
import { WorkspaceType } from "../../constants/workspace";
import { useAuthStore } from "../../../../shared/store/useAuthStore";
import { useGetUnits } from "../../../../shared/api/admin/admin.hooks";

// Mock the dependencies
vi.mock("../../../../shared/store/useAuthStore");
vi.mock("../../../../shared/api/admin/admin.hooks");

const theme = createTheme();

const mockUser = {
  id: "1",
  firstname: "Admin",
  lastname: "User",
  username: "adminuser",
  email: "admin@example.com",
  role: UserRole.SYSTEM_ADMIN,
  units: [
    {
      id: "unit-1",
      name: "Unit One",
      code: "U1",
      status: "active",
      color: "#ff0000",
    },
    {
      id: "unit-2",
      name: "Unit Two",
      code: "U2",
      status: "active",
      color: "#00ff00",
    },
  ],
  address: null,
  active: true,
};

const mockUnits = [
  {
    id: "unit-1",
    name: "Unit One",
    code: "U1",
    status: "active",
    color: "#ff0000",
    dailyVolume: "100L",
    mpcsUnits: 5,
  },
  {
    id: "unit-2",
    name: "Unit Two",
    code: "U2",
    status: "active",
    color: "#00ff00",
    dailyVolume: "200L",
    mpcsUnits: 10,
  },
  {
    id: "unit-3",
    name: "Unit Three",
    code: "U3",
    status: "inactive",
    color: "#0000ff",
    dailyVolume: "0L",
    mpcsUnits: 0,
  },
];

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe("WorkspaceModal", () => {
  const mockSetActiveUnit = vi.fn();
  const mockSetWorkspace = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as any).mockReturnValue({
      user: mockUser,
      activeUnit: null,
      setActiveUnit: mockSetActiveUnit,
      setWorkspace: mockSetWorkspace,
    });
    (useGetUnits as any).mockReturnValue({
      data: mockUnits,
      isLoading: false,
    });
  });

  it("renders the modal title and user info", () => {
    renderWithTheme(<WorkspaceModal open={true} onClose={mockOnClose} />);

    expect(screen.getByText("Select Workspace")).toBeInTheDocument();
    expect(screen.getByText("Access Management")).toBeInTheDocument();
    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
  });

  it("shows Global Administration for System Admin", () => {
    renderWithTheme(<WorkspaceModal open={true} onClose={mockOnClose} />);

    expect(screen.getByText("Global Administration")).toBeInTheDocument();
    expect(screen.getByText("SYSTEM-ROOT")).toBeInTheDocument();
  });

  it("shows unit list for System Admin", () => {
    renderWithTheme(<WorkspaceModal open={true} onClose={mockOnClose} />);

    expect(screen.getByText("Unit One")).toBeInTheDocument();
    expect(screen.getByText("Unit Two")).toBeInTheDocument();
    expect(screen.getByText("Unit Three")).toBeInTheDocument();
  });

  it("filters units when searching", () => {
    // We need more than 4 units to show search
    const manyUnits = [
      ...mockUnits,
      { id: "unit-4", name: "Unit Four", code: "U4", status: "active" },
      { id: "unit-5", name: "Unit Five", code: "U5", status: "active" },
    ];
    (useGetUnits as any).mockReturnValue({ data: manyUnits });

    renderWithTheme(<WorkspaceModal open={true} onClose={mockOnClose} />);

    const searchInput = screen.getByPlaceholderText(
      /Search by name, code or status.../i,
    );
    fireEvent.change(searchInput, { target: { value: "Three" } });

    expect(screen.getByText("Unit Three")).toBeInTheDocument();
    expect(screen.queryByText("Unit One")).not.toBeInTheDocument();
    expect(screen.queryByText("Unit Two")).not.toBeInTheDocument();
  });

  it("selects Global Administration by default if no active unit", () => {
    renderWithTheme(<WorkspaceModal open={true} onClose={mockOnClose} />);

    // Global Administration should be selected by default for System Admin if activeUnit is null
    // We can't easily check 'isSelected' prop but we can check if it calls handleConfirm with global
    fireEvent.click(screen.getByText("Switch to Workspace"));

    expect(mockSetActiveUnit).toHaveBeenCalledWith(null);
    expect(mockSetWorkspace).toHaveBeenCalledWith(WorkspaceType.SYSTEM_ADMIN);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("selects a unit and confirms switch", () => {
    renderWithTheme(<WorkspaceModal open={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText("Unit Two"));
    fireEvent.click(screen.getByText("Switch to Workspace"));

    expect(mockSetActiveUnit).toHaveBeenCalledWith(
      expect.objectContaining({ id: "unit-2", name: "Unit Two" }),
    );
    expect(mockSetWorkspace).toHaveBeenCalledWith(
      WorkspaceType.UNIT_MANAGEMENT,
    );
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onClose when Cancel is clicked", () => {
    renderWithTheme(<WorkspaceModal open={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("shows only user units for non-System Admin", () => {
    const regularUser = {
      ...mockUser,
      role: UserRole.UNIT_ADMIN,
      units: [mockUnits[0]],
    };
    (useAuthStore as any).mockReturnValue({
      user: regularUser,
      activeUnit: null,
      setActiveUnit: mockSetActiveUnit,
      setWorkspace: mockSetWorkspace,
    });
    (useGetUnits as any).mockReturnValue({ data: [], enabled: false });

    renderWithTheme(<WorkspaceModal open={true} onClose={mockOnClose} />);

    expect(screen.queryByText("Global Administration")).not.toBeInTheDocument();
    expect(screen.getByText("Unit One")).toBeInTheDocument();
    expect(screen.queryByText("Unit Two")).not.toBeInTheDocument();
  });
});
