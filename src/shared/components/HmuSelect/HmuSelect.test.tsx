import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HmuSelect from "./HmuSelect";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../theme";
import React from "react";

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

const options = [
  { label: "Option 1", value: 1, secondaryLabel: "Secondary 1" },
  { label: "Option 2", value: 2 },
];

describe("HmuSelect", () => {
  it("renders with label", () => {
    renderWithTheme(<HmuSelect label="Test Select" options={options} />);
    expect(screen.getByText("Test Select")).toBeInTheDocument();
  });

  it("shows helper text", () => {
    renderWithTheme(<HmuSelect helperText="Helper text" options={options} />);
    expect(screen.getByText("Helper text")).toBeInTheDocument();
  });

  it("renders with selected value", () => {
    renderWithTheme(<HmuSelect value={1} options={options} />);
    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it("opens menu and shows options when clicked", async () => {
    renderWithTheme(<HmuSelect label="Select" options={options} />);
    const select = screen.getByRole("combobox");
    fireEvent.mouseDown(select);

    expect(await screen.findByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Secondary 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("renders chips when multiple and renderChips is true", () => {
    renderWithTheme(
      <HmuSelect multiple value={[1, 2]} options={options} renderChips />,
    );
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("applies error state correctly", () => {
    renderWithTheme(
      <HmuSelect error helperText="Error message" options={options} />,
    );
    const helperText = screen.getByText("Error message");
    expect(helperText).toHaveClass("Mui-error");
  });
});
