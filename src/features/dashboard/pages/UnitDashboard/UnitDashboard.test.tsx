import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import UnitDashboard from "./UnitDashboard";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../shared/theme";
import { useAuthStore } from "../../../../shared/store/useAuthStore";

// Mock hooks
vi.mock("../../../../shared/hooks/useDocumentTitle", () => ({
  useDocumentTitle: vi.fn(),
}));

vi.mock("../../../../shared/store/useAuthStore", () => ({
  useAuthStore: vi.fn(),
}));

describe("UnitDashboard", () => {
  beforeEach(() => {
    vi.mocked(useAuthStore).mockReturnValue({
      activeUnit: { name: "Test Unit", code: "T001" },
    } as any);
  });

  it("renders the dashboard title and active unit info", () => {
    render(
      <ThemeProvider theme={theme}>
        <UnitDashboard />
      </ThemeProvider>
    );

    expect(screen.getByText("Unit Operations Dashboard")).toBeInTheDocument();
    expect(
      screen.getByText(/Currently managing: Test Unit \(T001\)/i)
    ).toBeInTheDocument();
  });

  it("renders the collection and dispatch stat cards", () => {
    render(
      <ThemeProvider theme={theme}>
        <UnitDashboard />
      </ThemeProvider>
    );

    expect(screen.getByText("Today's Collection")).toBeInTheDocument();
    expect(screen.getByText("1,250 L")).toBeInTheDocument();
    
    expect(screen.getByText("Active MPCS")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    
    expect(screen.getByText("Pending Bills")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    
    expect(screen.getByText("Total Dispatch")).toBeInTheDocument();
    expect(screen.getByText("850 L")).toBeInTheDocument();
  });

  it("handles case when no unit is selected", () => {
    vi.mocked(useAuthStore).mockReturnValue({
      activeUnit: null,
    } as any);

    render(
      <ThemeProvider theme={theme}>
        <UnitDashboard />
      </ThemeProvider>
    );

    expect(
      screen.getByText(/Currently managing: No Unit Selected \(N\/A\)/i)
    ).toBeInTheDocument();
  });
});
