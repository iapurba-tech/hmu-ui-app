import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BankDeleteModal from "./BankDeleteModal";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../../shared/theme";

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe("BankDeleteModal", () => {
  const mockOnConfirm = vi.fn();
  const mockOnClose = vi.fn();
  const mockBank = {
    id: "1",
    code: "BNK001",
    accountHolderName: "John Doe",
    bankName: "State Bank",
  } as any;

  it("renders with bank information", () => {
    renderWithTheme(
      <BankDeleteModal
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        bank={mockBank}
      />
    );
    
    // Use getByRole to find the header specifically
    expect(screen.getByRole("heading", { name: /Delete Bank Account/i })).toBeDefined();
    expect(screen.getByText(/John Doe/i)).toBeDefined();
    expect(screen.getByText(/State Bank/i)).toBeDefined();
    // Use getAllByText for the code as it might appear multiple times or in highlight
    expect(screen.getAllByText("BNK001")).toBeDefined();
  });

  it("disables delete button until bank code is typed correctly", () => {
    renderWithTheme(
      <BankDeleteModal
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        bank={mockBank}
      />
    );
    
    const deleteButton = screen.getByRole("button", { name: /Permanently Delete/i });
    const input = screen.getByPlaceholderText(/Type bank code here/i);
    
    expect(deleteButton.hasAttribute('disabled')).toBe(true);
    
    fireEvent.change(input, { target: { value: "WRONG" } });
    expect(deleteButton.hasAttribute('disabled')).toBe(true);
    
    fireEvent.change(input, { target: { value: "BNK001" } });
    expect(deleteButton.hasAttribute('disabled')).toBe(false);
  });

  it("calls onConfirm with bank id when button is clicked", () => {
    renderWithTheme(
      <BankDeleteModal
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        bank={mockBank}
      />
    );
    
    const input = screen.getByPlaceholderText(/Type bank code here/i);
    fireEvent.change(input, { target: { value: "BNK001" } });
    
    const deleteButton = screen.getByRole("button", { name: /Permanently Delete/i });
    fireEvent.click(deleteButton);
    
    expect(mockOnConfirm).toHaveBeenCalledWith("1");
  });
});
