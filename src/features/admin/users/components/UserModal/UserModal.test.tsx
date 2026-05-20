import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UserModal from "./UserModal";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../../shared/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as adminHooks from "../../../../../shared/api/admin/admin.hooks";
import React from "react";

// Mock the hooks
vi.mock("../../../../../shared/api/admin/admin.hooks", () => ({
  useCreateUser: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
  useUpdateUser: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
  useGetUnits: vi.fn(() => ({ data: [], isLoading: false })),
}));

// Mock UserForm to simplify testing UserModal logic
vi.mock("../UserForm/UserForm", () => ({
  default: ({ mode, onSubmit, onCancel }: any) => (
    <div data-testid="mock-user-form">
      <span>Mode: {mode}</span>
      <button onClick={() => onSubmit({ firstname: "New" })}>
        Submit Form
      </button>
      <button onClick={onCancel}>Cancel Form</button>
    </div>
  ),
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
    </QueryClientProvider>,
  );
};

describe("UserModal", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with correct title for create mode", () => {
    renderWithTheme(
      <UserModal open={true} onClose={mockOnClose} mode="create" />,
    );
    expect(screen.getByText("Add New User")).toBeInTheDocument();
  });

  it("renders with correct title for edit mode", () => {
    renderWithTheme(
      <UserModal open={true} onClose={mockOnClose} mode="edit" />,
    );
    expect(screen.getByText("Edit User")).toBeInTheDocument();
  });

  it("renders with correct title for view mode", () => {
    renderWithTheme(
      <UserModal open={true} onClose={mockOnClose} mode="view" />,
    );
    expect(screen.getByText("User Details")).toBeInTheDocument();
  });

  it("calls createUser hook on submit in create mode", async () => {
    const mockCreateUser = vi.fn();
    (adminHooks.useCreateUser as any).mockReturnValue({
      mutate: mockCreateUser,
      isPending: false,
    });

    renderWithTheme(
      <UserModal open={true} onClose={mockOnClose} mode="create" />,
    );

    fireEvent.click(screen.getByText("Submit Form"));

    expect(mockCreateUser).toHaveBeenCalledWith(
      { firstname: "New" },
      expect.any(Object),
    );
  });

  it("calls updateUser hook on submit in edit mode", async () => {
    const mockUpdateUser = vi.fn();
    (adminHooks.useUpdateUser as any).mockReturnValue({
      mutate: mockUpdateUser,
      isPending: false,
    });

    const mockUser = { id: "1", firstname: "Old" };
    renderWithTheme(
      <UserModal
        open={true}
        onClose={mockOnClose}
        mode="edit"
        user={mockUser as any}
      />,
    );

    fireEvent.click(screen.getByText("Submit Form"));

    expect(mockUpdateUser).toHaveBeenCalledWith(
      { id: "1", firstname: "New" },
      expect.any(Object),
    );
  });

  it("calls onClose when cancel is clicked in form", () => {
    renderWithTheme(
      <UserModal open={true} onClose={mockOnClose} mode="create" />,
    );
    fireEvent.click(screen.getByText("Cancel Form"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
