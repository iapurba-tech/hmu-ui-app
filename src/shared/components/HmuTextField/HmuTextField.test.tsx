import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HmuTextField from "./HmuTextField";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../theme";
import React from "react";

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe("HmuTextField", () => {
  it("renders with label", () => {
    renderWithTheme(<HmuTextField label="Test Label" />);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("renders required asterisk when required", () => {
    renderWithTheme(<HmuTextField label="Test Label" required />);
    const label = screen.getByText(/Test Label/);
    expect(label).toBeInTheDocument();
    // In MUI FormLabel, the asterisk is a separate span usually
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("renders start icon", () => {
    const StartIcon = () => <span data-testid="start-icon">icon</span>;
    renderWithTheme(<HmuTextField startIcon={<StartIcon />} />);
    expect(screen.getByTestId("start-icon")).toBeInTheDocument();
  });

  it("renders end icon", () => {
    const EndIcon = () => <span data-testid="end-icon">icon</span>;
    renderWithTheme(<HmuTextField endIcon={<EndIcon />} />);
    expect(screen.getByTestId("end-icon")).toBeInTheDocument();
  });

  it("shows helper text", () => {
    renderWithTheme(<HmuTextField helperText="Helper text" />);
    expect(screen.getByText("Helper text")).toBeInTheDocument();
  });

  it("applies error styles when error is true", () => {
    renderWithTheme(
      <HmuTextField label="Test Label" error helperText="Error message" />,
    );
    const helperText = screen.getByText("Error message");
    expect(helperText).toHaveClass("Mui-error");
  });
});
