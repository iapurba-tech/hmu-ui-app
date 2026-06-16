import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import InvoiceDetailModal from "./InvoiceDetailModal";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../shared/theme";
import type { InvoiceDetailResponse } from "../types/billing.types";

const mockInvoiceData: InvoiceDetailResponse = {
  invoice: {
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
    createdAt: "2026-06-10T12:00:00Z",
  },
  collections: [
    {
      id: "col-1",
      unitId: "unit-1",
      mpcsId: "mpcs-1",
      collectionDate: "2026-06-01",
      shift: "MORNING",
      quantity: 50,
      fatPercentage: 4,
      snfPercentage: 8,
      clr: 28,
      fatKg: 2,
      snfKg: 4,
      billed: true,
    },
    {
      id: "col-2",
      unitId: "unit-1",
      mpcsId: "mpcs-1",
      collectionDate: "2026-06-01",
      shift: "EVENING",
      quantity: 50,
      fatPercentage: 4,
      snfPercentage: 8,
      clr: 28,
      fatKg: 2,
      snfKg: 4,
      billed: true,
    },
  ],
  sales: [
    {
      id: "sale-1",
      unitId: "unit-1",
      mpcsId: "mpcs-1",
      productId: "prod-1",
      productName: "Feed",
      saleDate: "2026-06-05",
      quantity: 1,
      price: 200,
      totalAmount: 200,
      remarks: null,
      billed: true,
    },
  ],
  lineItems: [],
  pricing: {
    effectiveFatRate: 10,
    effectiveSnfRate: 10,
    effectiveCommissionRate: 1,
    effectiveIncentiveRate: 1,
  },
};

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe("InvoiceDetailModal", () => {
  it("renders loader when isLoading is true", () => {
    renderWithTheme(
      <InvoiceDetailModal
        open={true}
        onClose={vi.fn()}
        data={undefined}
        isLoading={true}
        mpcsName="Society A"
      />
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders nothing when data is undefined and isLoading is false", () => {
    const { container } = renderWithTheme(
      <InvoiceDetailModal
        open={true}
        onClose={vi.fn()}
        data={undefined}
        isLoading={false}
        mpcsName="Society A"
      />
    );

    expect(container.innerHTML).toBe("");
  });

  it("renders invoice details correctly", () => {
    renderWithTheme(
      <InvoiceDetailModal
        open={true}
        onClose={vi.fn()}
        data={mockInvoiceData}
        isLoading={false}
        mpcsName="Society A"
      />
    );

    // Header info
    expect(screen.getByText("Invoice Details")).toBeInTheDocument();
    expect(screen.getByText("Society A")).toBeInTheDocument();
    expect(screen.getByText("Bank A")).toBeInTheDocument();
    expect(screen.getByText(/1234567890/)).toBeInTheDocument();
    expect(screen.getByText("INV-001")).toBeInTheDocument();
    
    // Effective Rates
    expect(screen.getByText("Effective Rates Applied")).toBeInTheDocument();
    // Use getAllByText if there are multiple occurrences of '₹10.00'
    const tenRupees = screen.getAllByText("₹10.00");
    expect(tenRupees.length).toBeGreaterThan(0);

    // Collections
    expect(screen.getByText("Milk Collections")).toBeInTheDocument();
    expect(screen.getAllByText("01 Jun 2026").length).toBe(2);
    expect(screen.getByText("MORNING")).toBeInTheDocument();
    expect(screen.getByText("EVENING")).toBeInTheDocument();
    
    // Sales Deductions
    expect(screen.getByText("Product Sales Deductions")).toBeInTheDocument();
    expect(screen.getByText("Feed")).toBeInTheDocument();
    
    // Summary
    expect(screen.getByText("Payment Summary")).toBeInTheDocument();
    expect(screen.getByText("Base Milk Amount")).toBeInTheDocument();
    expect(screen.getByText("₹4,000.00")).toBeInTheDocument();
    expect(screen.getByText("+₹500.00")).toBeInTheDocument();
    expect(screen.getByText("-₹200.00")).toBeInTheDocument();
    expect(screen.getByText("₹4,300.00")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    renderWithTheme(
      <InvoiceDetailModal
        open={true}
        onClose={onClose}
        data={mockInvoiceData}
        isLoading={false}
        mpcsName="Society A"
      />
    );

    const closeButtons = screen.getAllByTestId("CloseIcon");
    fireEvent.click(closeButtons[0]);

    expect(onClose).toHaveBeenCalled();
  });
});
