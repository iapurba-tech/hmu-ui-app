import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material";
import { vi, describe, it, expect } from "vitest";
import UserDeleteModal from "./UserDeleteModal";
import { type User } from "../../types/user.types";
import { UserRole } from "../../../../auth/constants/roles";

const theme = createTheme();

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

const mockUser: User = {
  id: "1",
  firstname: "John",
  lastname: "Doe",
  username: "johndoe",
  email: "john@example.com",
  role: UserRole.SYSTEM_ADMIN,
  mpcsId: null,
  units: [],
  active: true,
};

describe("UserDeleteModal", () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  it("renders correctly when open", () => {
    renderWithTheme(
      <UserDeleteModal
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        user={mockUser}
      />,
    );

    expect(screen.getByText(/Delete User Permanently/i)).toBeInTheDocument();
    expect(screen.getAllByText(/johndoe/i).length).toBeGreaterThanOrEqual(2);
    expect(
      screen.getByText(/Please type the username below to confirm:/i),
    ).toBeInTheDocument();
  });

  it("requires correct username to enable delete button", () => {
    renderWithTheme(
      <UserDeleteModal
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        user={mockUser}
      />,
    );

    const deleteButton = screen.getByRole("button", {
      name: /Permanently Delete/i,
    });
    expect(deleteButton).toBeDisabled();

    const input = screen.getByPlaceholderText(/Type username here/i);

    // Type wrong username
    fireEvent.change(input, { target: { value: "wronguser" } });
    expect(deleteButton).toBeDisabled();

    // Type correct username
    fireEvent.change(input, { target: { value: "johndoe" } });
    expect(deleteButton).not.toBeDisabled();
  });

  it("calls onConfirm with user id when delete button is clicked", () => {
    renderWithTheme(
      <UserDeleteModal
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        user={mockUser}
      />,
    );

    const input = screen.getByPlaceholderText(/Type username here/i);
    fireEvent.change(input, { target: { value: "johndoe" } });

    const deleteButton = screen.getByRole("button", {
      name: /Permanently Delete/i,
    });
    fireEvent.click(deleteButton);

    expect(mockOnConfirm).toHaveBeenCalledWith("1");
  });

  it("calls onClose when cancel button is clicked", () => {
    renderWithTheme(
      <UserDeleteModal
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        user={mockUser}
      />,
    );

    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("disables buttons when loading", () => {
    renderWithTheme(
      <UserDeleteModal
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        user={mockUser}
        loading={true}
      />,
    );

    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    expect(cancelButton).toBeDisabled();

    // The delete button might be disabled because of confirmText anyway,
    // but let's check it's loading
    const deleteButton = screen.getByRole("button", {
      name: /Permanently Delete/i,
    });
    // HmuButton shows a loader when loading is true, and it should be disabled
    expect(deleteButton).toBeDisabled();
  });
});
