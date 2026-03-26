import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import Sidebar from "./Sidebar";
import { useLayoutStore } from "../../../shared/store/useLayoutStore";
import { useAuthStore } from "../../../shared/store/useAuthStore";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../shared/theme/theme";
import { WorkspaceType } from "../../../features/auth/constants/workspace";

const renderWithProviders = (initialEntries = ["/"]) => {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={initialEntries}>
        <Sidebar />
      </MemoryRouter>
    </ThemeProvider>,
  );
};

describe("Sidebar", () => {
  beforeEach(() => {
    // Reset stores
    useLayoutStore.getState().setSidebarOpen(true);
    useAuthStore.setState({
      workspace: WorkspaceType.UNIT_MANAGEMENT,
      activeUnit: { id: "1", name: "Test Unit", code: "T01" } as any,
    });
  });

  it("renders management menu items correctly", () => {
    renderWithProviders();

    // Check for sections
    expect(screen.getByText("Main Menu")).toBeInTheDocument();
    expect(screen.getByText("Daily Operations")).toBeInTheDocument();
    expect(screen.getByText("Finance")).toBeInTheDocument();

    // Check for specific items
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("MPCS")).toBeInTheDocument();
    expect(screen.getByText("Milk Collections")).toBeInTheDocument();
    expect(screen.getByText("Sales")).toBeInTheDocument();
    expect(screen.getByText("Dispatch")).toBeInTheDocument();
    expect(screen.getByText("Billing")).toBeInTheDocument();
    expect(screen.getByText("Bank Advice")).toBeInTheDocument();
  });

  it("renders admin menu items correctly when in system admin workspace", () => {
    useAuthStore.setState({
      workspace: WorkspaceType.SYSTEM_ADMIN,
      activeUnit: null,
    });

    renderWithProviders();

    // Check for sections
    expect(screen.getByText("Main Menu")).toBeInTheDocument();
    expect(screen.getByText("Organization & Finance")).toBeInTheDocument();
    expect(screen.getByText("Catalog & Pricing")).toBeInTheDocument();

    // Check for specific items
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Units")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("Bank Accounts")).toBeInTheDocument();
    expect(screen.getByText("Pricing")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Head Load")).toBeInTheDocument();
  });

  it("highlights the active menu item based on current path", () => {
    renderWithProviders(["/unit/procurement/milk-collections"]);

    const activeItem = screen.getByText("Milk Collections").closest("a");
    // Check if the item is selected. MUI's ListItemButton with 'selected' prop
    // adds a specific class or style. We can check for the 'Mui-selected' class.
    expect(activeItem).toHaveClass("Mui-selected");

    const inactiveItem = screen.getByText("Dashboard").closest("a");
    expect(inactiveItem).not.toHaveClass("Mui-selected");
  });

  it("renders WorkspaceIdentity with correct information", () => {
    renderWithProviders();

    // Check if WorkspaceIdentity content is present
    expect(screen.getByText("Test Unit")).toBeInTheDocument();
    expect(screen.getByText("Management Portal")).toBeInTheDocument();
  });

  it("renders AppHealthStatus", () => {
    renderWithProviders();

    // Check if AppHealthStatus content is present
    expect(screen.getByText("System Health")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
