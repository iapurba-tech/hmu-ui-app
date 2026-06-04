import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SystemDashboard from "./SystemDashboard";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../shared/theme";

// Mock useDocumentTitle
vi.mock("../../../../shared/hooks/useDocumentTitle", () => ({
  useDocumentTitle: vi.fn(),
}));

describe("SystemDashboard", () => {
  it("renders the dashboard title", () => {
    render(
      <ThemeProvider theme={theme}>
        <SystemDashboard />
      </ThemeProvider>
    );

    expect(
      screen.getByText("System Administration Dashboard")
    ).toBeInTheDocument();
  });

  it("renders the stat cards", () => {
    render(
      <ThemeProvider theme={theme}>
        <SystemDashboard />
      </ThemeProvider>
    );

    expect(screen.getByText("Total Units")).toBeInTheDocument();
    expect(screen.getByText("24")).toBeInTheDocument();
    
    expect(screen.getByText("Active Users")).toBeInTheDocument();
    expect(screen.getByText("156")).toBeInTheDocument();
    
    expect(screen.getByText("System Health")).toBeInTheDocument();
    expect(screen.getByText("Healthy")).toBeInTheDocument();
  });
});
