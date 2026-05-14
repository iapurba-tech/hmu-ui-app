import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HmuButton from "./HmuButton";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../shared/theme";

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe("HmuButton", () => {
  it("renders label correctly", () => {
    renderWithTheme(<HmuButton label="Click me" />);
    expect(screen.getByText("Click me")).toBeDefined();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    renderWithTheme(<HmuButton label="Click me" onClick={handleClick} />);
    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when loading prop is true", () => {
    renderWithTheme(<HmuButton label="Click me" loading />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("shows circular progress when loading", () => {
    renderWithTheme(<HmuButton label="Click me" loading />);
    expect(screen.getByRole("progressbar")).toBeDefined();
  });

  it("is disabled when disabled prop is true", () => {
    renderWithTheme(<HmuButton label="Click me" disabled />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("applies primary variant styles by default", () => {
    renderWithTheme(<HmuButton label="Click me" />);
    const button = screen.getByRole("button");
    expect(button.classList.contains("MuiButton-contained")).toBe(true);
  });

  it("applies secondary variant styles when specified", () => {
    renderWithTheme(<HmuButton label="Click me" variant="secondary" />);
    const button = screen.getByRole("button");
    expect(button.classList.contains("MuiButton-outlined")).toBe(true);
  });

  it("applies text variant styles when specified", () => {
    renderWithTheme(<HmuButton label="Click me" variant="text" />);
    const button = screen.getByRole("button");
    expect(button.classList.contains("MuiButton-text")).toBe(true);
  });

  it("applies dark variant styles when specified", () => {
    renderWithTheme(<HmuButton label="Click me" variant="dark" />);
    const button = screen.getByRole("button");
    expect(button.classList.contains("MuiButton-contained")).toBe(true);
  });

  it("is accessible with aria-label", () => {
    renderWithTheme(<HmuButton label="Click me" aria-label="custom label" />);
    expect(screen.getByLabelText("custom label")).toBeDefined();
  });
});
