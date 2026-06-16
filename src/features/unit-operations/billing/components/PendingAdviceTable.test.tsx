import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PendingAdviceTable from "./PendingAdviceTable";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../shared/theme";
import type { BillingRun } from "../types/billing.types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as bankHooks from "../../../../shared/api/admin/bank/bank.hooks";

vi.mock("../../../../shared/api/admin/bank/bank.hooks", () => ({
  useGetBankAccounts: vi.fn(),
}));

vi.mock("../../../../shared/store/useAuthStore", () => ({
  useAuthStore: vi.fn(() => ({
    activeUnit: { id: "unit-1", name: "Unit 1" },
  })),
}));

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
];

const mockBanks = [
  {
    id: "bank-1",
    bankName: "SBI",
    accountNumber: "123456",
    unit: { id: "unit-1" },
  },
];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </QueryClientProvider>,
  );
};

describe("PendingAdviceTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (bankHooks.useGetBankAccounts as any).mockReturnValue({
      data: mockBanks,
      isLoading: false,
    });
  });

  it("renders pending runs correctly", () => {
    renderWithTheme(
      <PendingAdviceTable
        runs={mockRuns}
        isLoading={false}
        onGenerate={vi.fn()}
        isGenerating={false}
      />,
    );

    expect(screen.getByText("Pending Generation")).toBeInTheDocument();
    expect(screen.getByText("1 Pending")).toBeInTheDocument();
    expect(screen.getByText(/01 Jun - 10 Jun, 2026/i)).toBeInTheDocument();
  });

  it("allows inline editing and submission", async () => {
    const onGenerate = vi.fn();
    renderWithTheme(
      <PendingAdviceTable
        runs={mockRuns}
        isLoading={false}
        onGenerate={onGenerate}
        isGenerating={false}
      />,
    );

    // Click generate button
    const generateBtn = screen.getByLabelText("generate-advice");
    fireEvent.click(generateBtn);

    // Enter cheque number
    const chequeInput = screen.getByPlaceholderText("Enter Cheque #");
    fireEvent.change(chequeInput, { target: { value: "CHQ123" } });

    // Click save
    const saveBtn = screen.getByLabelText("save-advice");
    fireEvent.click(saveBtn);

    expect(onGenerate).toHaveBeenCalledWith({
      billingRunId: "run-1",
      payoutBankId: "bank-1",
      chequeNumber: "CHQ123",
    });
  });

  it("allows cancelling inline edit", () => {
    renderWithTheme(
      <PendingAdviceTable
        runs={mockRuns}
        isLoading={false}
        onGenerate={vi.fn()}
        isGenerating={false}
      />,
    );

    // Click generate button
    const generateBtn = screen.getByLabelText("generate-advice");
    fireEvent.click(generateBtn);

    // Cancel edit
    const cancelBtn = screen.getByLabelText("cancel-edit");
    fireEvent.click(cancelBtn);

    // Should revert back to default state
    expect(screen.getByText("Select bank...")).toBeInTheDocument();
  });
});
