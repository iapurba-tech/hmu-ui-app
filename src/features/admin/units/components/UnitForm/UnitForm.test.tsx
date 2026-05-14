import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import UnitForm from "./UnitForm";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../../shared/theme";

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe("UnitForm", () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  it("renders all address fields and group headings", () => {
    renderWithTheme(<UnitForm mode="create" onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByText(/Unit Information/i)).toBeDefined();
    expect(screen.getByText(/Address Details/i)).toBeDefined();
    expect(screen.getByLabelText(/Unit Name/i)).toBeDefined();
    expect(screen.getByLabelText(/Unit Code/i)).toBeDefined();
    expect(screen.getByLabelText(/Address Line 1/i)).toBeDefined();
    expect(screen.getByLabelText(/Address Line 2/i)).toBeDefined();
    expect(screen.getByLabelText(/City/i)).toBeDefined();
    expect(screen.getByLabelText(/District/i)).toBeDefined();
    expect(screen.getByLabelText(/State/i)).toBeDefined();
    expect(screen.getByLabelText(/Postal Code/i)).toBeDefined();
  });

  it("submits the form with correct data structure", async () => {
    renderWithTheme(<UnitForm mode="create" onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    fireEvent.change(screen.getByLabelText(/Unit Name/i), { target: { value: "Test Unit" } });
    fireEvent.change(screen.getByLabelText(/Unit Code/i), { target: { value: "TU-001" } });
    fireEvent.change(screen.getByLabelText(/Address Line 1/i), { target: { value: "123 Street" } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: "Test City" } });
    fireEvent.change(screen.getByLabelText(/District/i), { target: { value: "Test District" } });
    fireEvent.change(screen.getByLabelText(/State/i), { target: { value: "Test State" } });
    fireEvent.change(screen.getByLabelText(/Postal Code/i), { target: { value: "12345" } });
    
    fireEvent.click(screen.getByRole("button", { name: /Create Unit/i }));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Test Unit",
          code: "TU-001",
          address: {
            addressLine1: "123 Street",
            addressLine2: "",
            city: "Test City",
            district: "Test District",
            state: "Test State",
            postalCode: "12345",
          },
          active: true,
        }),
        expect.anything()
      );
    });
  });

  it("shows validation errors for required fields", async () => {
    renderWithTheme(<UnitForm mode="create" onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    fireEvent.click(screen.getByRole("button", { name: /Create Unit/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Unit Name is required/i)).toBeDefined();
      expect(screen.getByText(/Unit Code is required/i)).toBeDefined();
      expect(screen.getByText(/Address Line 1 is required/i)).toBeDefined();
    });

    // Optional fields should NOT show error messages
    expect(screen.queryByText(/City is required/i)).toBeNull();
    expect(screen.queryByText(/District is required/i)).toBeNull();
    expect(screen.queryByText(/State is required/i)).toBeNull();
    expect(screen.queryByText(/Postal Code is required/i)).toBeNull();
  });

  it("disables unit code field in edit mode", () => {
    renderWithTheme(
      <UnitForm
        mode="edit"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        defaultValues={{ code: "EXISTING-CODE" }}
      />
    );
    
    const codeInput = screen.getByLabelText(/Unit Code/i) as HTMLInputElement;
    expect(codeInput.disabled).toBe(true);
  });
});
