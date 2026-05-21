import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UserForm from "./UserForm";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../../shared/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserRole } from "../../../../auth/constants/roles";

// Mock the hooks
vi.mock("../../../../../shared/api/admin/admin.hooks", () => ({
  useGetUnits: vi.fn(() => ({ data: [], isLoading: false })),
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

describe("UserForm", () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders in create mode with empty fields", () => {
    renderWithTheme(
      <UserForm
        mode="create"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.getByLabelText(/First Name/i)).toHaveValue("");
    expect(screen.getByLabelText(/Last Name/i)).toHaveValue("");
    expect(screen.getByLabelText(/Email Address/i)).toHaveValue("");
    expect(
      screen.getByRole("button", { name: /Create User/i }),
    ).toBeInTheDocument();
  });

  it("renders in view mode with data and disabled fields", () => {
    const defaultValues = {
      firstname: "Apurba",
      lastname: "Panja",
      email: "apurba@example.com",
      username: "apurba",
      role: UserRole.SYSTEM_ADMIN,
    };

    renderWithTheme(
      <UserForm
        mode="view"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        defaultValues={defaultValues as any}
      />,
    );

    expect(screen.getByText("Apurba")).toBeInTheDocument();
    expect(screen.getByText("Panja")).toBeInTheDocument();
    expect(screen.getByText("apurba@example.com")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Create User/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Close/i })).toBeInTheDocument();
  });

  it("shows validation errors for required fields", async () => {
    renderWithTheme(
      <UserForm
        mode="create"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Create User/i }));

    await waitFor(() => {
      const helperTexts = screen.getAllByText(/required/i);
      expect(helperTexts.length).toBeGreaterThan(0);
    });
  });

  it("calls onSubmit with formatted data when valid", async () => {
    renderWithTheme(
      <UserForm
        mode="create"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />,
    );

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    // Select a role
    const roleSelect = screen.getByLabelText(/Role/i);
    fireEvent.mouseDown(roleSelect);
    const option = await screen.findByText("UNIT ADMIN");
    fireEvent.click(option);

    // Address is visible by default, so we fill it directly
    fireEvent.change(screen.getByLabelText(/Address Line 1/i), {
      target: { value: "Street 1" },
    });
    fireEvent.change(screen.getByLabelText(/City/i), {
      target: { value: "Kolkata" },
    });
    fireEvent.change(screen.getByLabelText(/District/i), {
      target: { value: "Howrah" },
    });
    fireEvent.change(screen.getByLabelText(/State/i), {
      target: { value: "WB" },
    });
    fireEvent.change(screen.getByLabelText(/Postal Code/i), {
      target: { value: "711313" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create User/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
      const submittedData = mockOnSubmit.mock.calls[0][0];
      expect(submittedData.firstname).toBe("John");
      expect(submittedData.email).toBe("john@example.com");
      expect(submittedData.address.addressLine1).toBe("Street 1");
    });
  });

  it("passes validation when address is completely skipped", async () => {
    renderWithTheme(
      <UserForm
        mode="create"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />,
    );

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    // Select a role
    const roleSelect = screen.getByLabelText(/Role/i);
    fireEvent.mouseDown(roleSelect);
    const option = await screen.findByText("UNIT ADMIN");
    fireEvent.click(option);

    // Skip address
    fireEvent.click(screen.getByLabelText(/Skip Address Information/i));

    fireEvent.click(screen.getByRole("button", { name: /Create User/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
      const submittedData = mockOnSubmit.mock.calls[0][0];
      expect(submittedData.address.addressLine1).toBeNull();
    });
  });

  it("fails validation when address is partially filled", async () => {
    renderWithTheme(
      <UserForm
        mode="create"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />,
    );

    // Only fill city (form is visible by default)
    fireEvent.change(screen.getByLabelText(/City/i), {
      target: { value: "Kolkata" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create User/i }));

    await waitFor(() => {
      const helperTexts = screen.getAllByText(/required/i);
      expect(helperTexts.length).toBeGreaterThan(0);
    });
  });

  it("hides assigned units field when System Admin role is selected", async () => {
    renderWithTheme(
      <UserForm
        mode="create"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />,
    );

    // Initial role is UNIT_ADMIN (default), so Assigned Units should be visible
    expect(screen.getByText(/Assigned Units/i)).toBeInTheDocument();

    // Change role to SYSTEM_ADMIN
    const roleSelect = screen.getByRole("combobox", { name: /Role/i });
    fireEvent.mouseDown(roleSelect);
    const systemAdminOption = await screen.findByText("SYSTEM ADMIN");
    fireEvent.click(systemAdminOption);

    expect(screen.queryByText(/Assigned Units/i)).not.toBeInTheDocument();
  });
});
