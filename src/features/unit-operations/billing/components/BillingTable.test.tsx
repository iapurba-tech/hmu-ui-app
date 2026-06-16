import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BillingTable from "./BillingTable";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../shared/theme";
import type { BillingRun } from "../types/billing.types";

const mockRuns: BillingRun[] = [
  {
    id: "run-1",
    unitId: "unit-1",
    periodStartDate: "2026-06-01",
    periodEndDate: "2026-06-10",
    status: "COMPLETED",
    processedBy: "user-1",
    processedAt: "2026-06-10T12:00:00Z",
    createdAt: "2026-06-10T12:00:00Z",
  },
  {
    id: "run-2",
    unitId: "unit-1",
    periodStartDate: "2026-06-11",
    periodEndDate: "2026-06-20",
    status: "PENDING",
    processedBy: "user-1",
    processedAt: "",
    createdAt: "2026-06-20T12:00:00Z",
  },
];

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe("BillingTable", () => {
  it("renders the table with correct columns and data", () => {
    const onDelete = vi.fn();
    const onView = vi.fn();
    
    renderWithTheme(
      <BillingTable runs={mockRuns} isLoading={false} onDelete={onDelete} onView={onView} />
    );

    expect(screen.getByText("Previous Runs")).toBeInTheDocument();
    
    // Check if dates are formatted and rendered
    expect(screen.getByText(/Jun 01, 2026 - Jun 10, 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/Jun 11, 2026 - Jun 20, 2026/i)).toBeInTheDocument();
    
    // Check if status chips are rendered
    expect(screen.getByText("COMPLETED")).toBeInTheDocument();
    expect(screen.getByText("PENDING")).toBeInTheDocument();
  });

  it("calls onView when view button is clicked", () => {
    const onDelete = vi.fn();
    const onView = vi.fn();
    
    renderWithTheme(
      <BillingTable runs={mockRuns} isLoading={false} onDelete={onDelete} onView={onView} />
    );

    const viewButtons = screen.getAllByLabelText("view-invoices");
    fireEvent.click(viewButtons[0]);

    expect(onView).toHaveBeenCalledWith("run-1");
  });

  it("calls onDelete when delete button is clicked", () => {
    const onDelete = vi.fn();
    const onView = vi.fn();
    
    renderWithTheme(
      <BillingTable runs={mockRuns} isLoading={false} onDelete={onDelete} onView={onView} />
    );

    const deleteButtons = screen.getAllByLabelText("delete-run");
    fireEvent.click(deleteButtons[1]);

    expect(onDelete).toHaveBeenCalledWith("run-2");
  });

  it("shows empty message when there are no runs", () => {
    renderWithTheme(
      <BillingTable runs={[]} isLoading={false} onDelete={vi.fn()} onView={vi.fn()} />
    );

    expect(screen.getByText("No billing runs found")).toBeInTheDocument();
  });
});
