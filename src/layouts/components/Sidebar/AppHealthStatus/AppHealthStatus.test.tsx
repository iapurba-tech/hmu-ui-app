import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AppHealthStatus from "./AppHealthStatus";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../shared/theme/theme";

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe("AppHealthStatus", () => {
  it("renders correctly", () => {
    renderWithTheme(<AppHealthStatus />);
    expect(screen.getByText("System Health")).toBeDefined();
    expect(screen.getByRole("progressbar")).toBeDefined();
  });
});
