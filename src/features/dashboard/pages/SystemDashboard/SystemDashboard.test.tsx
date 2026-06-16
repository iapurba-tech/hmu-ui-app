import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SystemDashboard from "./SystemDashboard";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../shared/theme";

// Mock useDocumentTitle
vi.mock("../../../../shared/hooks/useDocumentTitle", () => ({
  useDocumentTitle: vi.fn(),
}));

// Mock Recharts ResponsiveContainer to prevent width/height warnings in jsdom
vi.mock("recharts", async () => {
  const OriginalRechartsModule = await vi.importActual("recharts");
  return {
    ...OriginalRechartsModule,
    ResponsiveContainer: ({ children }: any) => (
      <div style={{ width: 800, height: 400 }}>{children}</div>
    ),
  };
});

describe("SystemDashboard", () => {
  it("renders the stat cards and metrics", () => {
    render(
      <ThemeProvider theme={theme}>
        <SystemDashboard />
      </ThemeProvider>
    );

    expect(screen.getByText("Total Revenue")).toBeInTheDocument();
    expect(screen.getByText("₹45.00L")).toBeInTheDocument(); // 4500000 -> 45L
    
    expect(screen.getByText("Milk Collections")).toBeInTheDocument();
    expect(screen.getByText("125.4 Tonnes")).toBeInTheDocument();
    
    expect(screen.getByText("Active Units")).toBeInTheDocument();
    expect(screen.getByText("42 / 45")).toBeInTheDocument();

    expect(screen.getByText("Active Users")).toBeInTheDocument();
    expect(screen.getByText("856")).toBeInTheDocument();
  });

  it("renders the chart sections", () => {
    render(
      <ThemeProvider theme={theme}>
        <SystemDashboard />
      </ThemeProvider>
    );

    expect(screen.getByText("7-Day Collection Volume")).toBeInTheDocument();
    expect(screen.getByText("Volume by Unit")).toBeInTheDocument();
    expect(screen.getByText("Product Sales Breakdown")).toBeInTheDocument();
    expect(screen.getByText("Pricing Trend (YTD)")).toBeInTheDocument();
  });
});
