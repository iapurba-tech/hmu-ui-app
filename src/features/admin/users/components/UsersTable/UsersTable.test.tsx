import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UsersTable from "./UsersTable";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../../shared/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserRole } from "../../../../auth/constants/roles";
import * as adminHooks from "../../../../../shared/api/admin/admin.hooks";
import React from "react";

// Mock the hooks
vi.mock("../../../../../shared/api/admin/admin.hooks", () => ({
  useToggleUserStatus: vi.fn(() => ({
    mutate: vi.fn((options) => {
      if (options?.onSuccess) options.onSuccess();
    }),
    isPending: false,
  })),
  useDeleteUserPermanent: vi.fn(() => ({
    mutate: vi.fn((options) => {
      if (options?.onSuccess) options.onSuccess();
    }),
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

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </QueryClientProvider>
  );
};

describe("UsersTable", () => {
  const mockUsers = [
    {
      id: "1",
      firstname: "Apurba",
      lastname: "Panja",
      username: "apurba",
      email: "apurba@example.com",
      role: UserRole.SYSTEM_ADMIN,
      active: true,
    },
    {
      id: "2",
      firstname: "John",
      lastname: "Doe",
      username: "johndoe",
      email: "john@example.com",
      role: UserRole.UNIT_ADMIN,
      active: false,
    },
  ];

  const mockOnView = vi.fn();
  const mockOnEdit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders user data correctly", () => {
    renderWithTheme(
      <UsersTable
        users={mockUsers as any}
        isLoading={false}
        onView={mockOnView}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText("Apurba Panja")).toBeInTheDocument();
    expect(screen.getByText("apurba")).toBeInTheDocument();
    expect(screen.getByText("SYSTEM ADMIN")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  it("calls onView when a row is clicked", () => {
    renderWithTheme(
      <UsersTable
        users={mockUsers as any}
        isLoading={false}
        onView={mockOnView}
        onEdit={mockOnEdit}
      />
    );

    fireEvent.click(screen.getByText("Apurba Panja"));
    expect(mockOnView).toHaveBeenCalledWith(mockUsers[0]);
  });

  it("calls onEdit when edit icon is clicked", () => {
    renderWithTheme(
      <UsersTable
        users={mockUsers as any}
        isLoading={false}
        onView={mockOnView}
        onEdit={mockOnEdit}
      />
    );

    const editButtons = screen.getAllByTestId(/Edit.*Icon/);
    fireEvent.click(editButtons[0]);
    expect(mockOnEdit).toHaveBeenCalledWith(mockUsers[0]);
  });

  it("opens confirmation modal when status switch is clicked", async () => {
    renderWithTheme(
      <UsersTable
        users={mockUsers as any}
        isLoading={false}
        onView={mockOnView}
        onEdit={mockOnEdit}
      />
    );

    const switches = screen.getAllByRole("switch");
    fireEvent.click(switches[0]);

    expect(screen.getByText(/Are you sure you want to deactivate user "Apurba Panja"?/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Deactivate" })).toBeInTheDocument();
  });

  it("calls toggleStatus API when confirmed in modal", async () => {
    const mockToggleStatus = vi.fn();
    (adminHooks.useToggleUserStatus as any).mockReturnValue({
      mutate: mockToggleStatus,
      isPending: false,
    });

    renderWithTheme(
      <UsersTable
        users={mockUsers as any}
        isLoading={false}
        onView={mockOnView}
        onEdit={mockOnEdit}
      />
    );

    const switches = screen.getAllByRole("switch");
    fireEvent.click(switches[0]);

    const confirmButton = screen.getByRole("button", { name: "Deactivate" });
    fireEvent.click(confirmButton);

    expect(mockToggleStatus).toHaveBeenCalledWith(
      { id: "1", active: true },
      expect.any(Object),
    );
  });

  it("opens delete confirmation modal and requires username input", async () => {
    renderWithTheme(
      <UsersTable
        users={mockUsers as any}
        isLoading={false}
        onView={mockOnView}
        onEdit={mockOnEdit}
      />,
    );

    const deleteButtons = screen.getAllByRole("button", {
      name: /delete permanently/i,
    });
    fireEvent.click(deleteButtons[0]);

    expect(screen.getByText(/Delete User Permanently/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Please type the username below to confirm:/i),
    ).toBeInTheDocument();
    expect(screen.getAllByText("apurba").length).toBeGreaterThanOrEqual(2);

    const deleteButton = screen.getByRole("button", {
      name: /Permanently Delete/i,
    });
    expect(deleteButton).toBeDisabled();

    const input = screen.getByPlaceholderText(/Type username here/i);
    fireEvent.change(input, { target: { value: "apurba" } });

    expect(deleteButton).not.toBeDisabled();
  });

  it("calls deleteUserPermanent API when confirmed with correct username", async () => {
    const mockDeletePermanent = vi.fn();
    (adminHooks.useDeleteUserPermanent as any).mockReturnValue({
      mutate: mockDeletePermanent,
      isPending: false,
    });

    renderWithTheme(
      <UsersTable
        users={mockUsers as any}
        isLoading={false}
        onView={mockOnView}
        onEdit={mockOnEdit}
      />,
    );

    const deleteButtons = screen.getAllByRole("button", {
      name: /delete permanently/i,
    });
    fireEvent.click(deleteButtons[0]);

    const input = screen.getByPlaceholderText(/Type username here/i);
    fireEvent.change(input, { target: { value: "apurba" } });

    const deleteButton = screen.getByRole("button", {
      name: /Permanently Delete/i,
    });
    fireEvent.click(deleteButton);

    expect(mockDeletePermanent).toHaveBeenCalledWith("1", expect.any(Object));
  });
});
