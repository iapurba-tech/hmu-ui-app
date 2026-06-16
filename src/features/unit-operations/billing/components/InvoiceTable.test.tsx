import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import InvoiceTable from "./InvoiceTable";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../shared/theme";
import type { BillingInvoice } from "../types/billing.types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as billingHooks from "../../../../shared/api/unit/billing/billing.hooks";

// Mock the hooks
vi.mock("../../../../shared/api/unit/billing/billing.hooks", () => ({
  useGetInvoiceDetail: vi.fn(),
}));

const mockInvoices: BillingInvoice[] = [
  {
    id: "inv-1",
    mpcsId: "mpcs-1",
    invoiceNumber: "INV-001",
    bankAccountNumber: "1234567890",
    bankIfscCode: "IFSC001",
    bankName: "Bank A",
    totalMilkQuantity: 100,
    totalFatKg: 4,
    totalSnfKg: 8,
    baseMilkAmount: 4000,
    totalAdditions: 500,
    totalDeductions: 200,
    netPayableAmount: 4300,
    status: "GENERATED",
  },
];

const mockMpcsMap = {
  "mpcs-1": "Society A",
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </QueryClientProvider>
  );
};

describe("InvoiceTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (billingHooks.useGetInvoiceDetail as any).mockImplementation((id: string) => ({
      data: id === "inv-1" ? {
        invoice: mockInvoices[0],
        collections: [],
        sales: [],
        lineItems: [],
        pricing: { effectiveFatRate: 1, effectiveSnfRate: 1, effectiveCommissionRate: 1, effectiveIncentiveRate: 1 }
      } : undefined,
      isLoading: false,
    }));
    
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  it("renders the table with correct columns and data", () => {
    renderWithProviders(
      <InvoiceTable invoices={mockInvoices} isLoading={false} mpcsMap={mockMpcsMap} />
    );

    expect(screen.getByText("Generated Invoices")).toBeInTheDocument();
    expect(screen.getByText("INV-001")).toBeInTheDocument();
    expect(screen.getByText("Society A")).toBeInTheDocument();
    expect(screen.getByText("100.00")).toBeInTheDocument();
    expect(screen.getByText("₹4,300.00")).toBeInTheDocument();
    expect(screen.getByText("GENERATED")).toBeInTheDocument();
  });

  it("copies invoice number when copy button is clicked", async () => {
    renderWithProviders(
      <InvoiceTable invoices={mockInvoices} isLoading={false} mpcsMap={mockMpcsMap} />
    );

    const copyButtons = screen.getAllByTestId("ContentCopyRoundedIcon");
    fireEvent.click(copyButtons[0]);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("INV-001");
  });

  it("opens modal when view detail button is clicked", () => {
    renderWithProviders(
      <InvoiceTable invoices={mockInvoices} isLoading={false} mpcsMap={mockMpcsMap} />
    );

    const viewButtons = screen.getAllByTestId("VisibilityRoundedIcon");
    fireEvent.click(viewButtons[0]);

    // The modal should open, showing "Invoice Details"
    expect(screen.getByText("Invoice Details")).toBeInTheDocument();
  });
});
