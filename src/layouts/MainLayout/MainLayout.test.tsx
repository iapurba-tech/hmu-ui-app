import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import MainLayout from "./MainLayout";
import { useLayoutStore } from "../../shared/store/useLayoutStore";
import { useAuthStore } from "../../shared/store/useAuthStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe("Main Layout", () => {
  beforeEach(() => {
    // Reset store state before each test
    useLayoutStore.getState().setSidebarOpen(true);

    // Set up auth store for testing
    useAuthStore.setState({
      activeUnit: { id: 1, name: "Shyampur Facility", code: "SHY" } as any,
      workspace: "management" as any,
    });
  });

  it("should render the Top Navigation and Sidebar", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MainLayout />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    // Changed to match current TopNav and Sidebar text
    expect(screen.getByText(/Management Portal/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Shyampur Facility/i).length).toBeGreaterThan(0);
    expect(
      screen.getByPlaceholderText(/Search data, units or users/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/System Health/i)).toBeInTheDocument();
  });

  it("should toggle the sidebar when the menu button is clicked", async () => {
    const { default: userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MainLayout />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const menuButton = screen.getByLabelText(/open drawer/i);

    // Initial state: Sidebar open
    expect(useLayoutStore.getState().isSidebarOpen).toBe(true);

    // Click to toggle (Close)
    await user.click(menuButton);
    expect(useLayoutStore.getState().isSidebarOpen).toBe(false);

    // Click to toggle (Open)
    await user.click(menuButton);
    expect(useLayoutStore.getState().isSidebarOpen).toBe(true);
  });
});
