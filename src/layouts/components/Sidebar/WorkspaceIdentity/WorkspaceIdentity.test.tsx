import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import WorkspaceIdentity from "./WorkspaceIdentity";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../shared/theme/theme";

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe("WorkspaceIdentity", () => {
  it("renders Administration Portal correctly", () => {
    renderWithTheme(<WorkspaceIdentity isAdminWorkspace={true} />);
    expect(screen.getByText("Administration Portal")).toBeDefined();
    expect(screen.getByText("HMU Global")).toBeDefined();
  });

  it("renders Management Portal with unit name", () => {
    renderWithTheme(
      <WorkspaceIdentity
        isAdminWorkspace={false}
        unitName="Test Unit"
      />,
    );
    expect(screen.getByText("Management Portal")).toBeDefined();
    expect(screen.getByText("Test Unit")).toBeDefined();
  });

  it("renders Management Portal with default text when no unit name", () => {
    renderWithTheme(<WorkspaceIdentity isAdminWorkspace={false} />);
    expect(screen.getByText("Management Portal")).toBeDefined();
    expect(screen.getByText("Select Unit")).toBeDefined();
  });
});
