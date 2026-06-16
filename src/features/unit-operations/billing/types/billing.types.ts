export type BillingStatus = "PENDING" | "PROCESSED" | "FAILED" | "COMPLETED";

export interface BillingRun {
  id: string;
  unitId: string;
  periodStartDate: string;
  periodEndDate: string;
  status: BillingStatus;
  processedBy: string;
  processedAt: string;
  createdAt: string;
}

export interface BillingRunCreateRequest {
  unitId: string;
  startDate: string;
  endDate: string;
}

export interface BillingInvoice {
  id: string;
  mpcsId: string;
  mpcsName?: string;
  invoiceNumber: string;
  bankAccountNumber: string;
  bankIfscCode: string | null;
  bankName: string | null;
  totalMilkQuantity: number;
  totalFatKg: number;
  totalSnfKg: number;
  baseMilkAmount: number;
  totalAdditions: number;
  totalDeductions: number;
  netPayableAmount: number;
  status: string;
  createdAt?: string;
}

export interface InvoiceCollection {
  id: string;
  unitId: string;
  mpcsId: string;
  collectionDate: string;
  shift: string;
  quantity: number;
  fatPercentage: number;
  snfPercentage: number;
  clr: number;
  fatKg: number;
  snfKg: number;
  billed: boolean;
}

export interface InvoiceSale {
  id: string;
  unitId: string;
  mpcsId: string;
  productId: string;
  productName: string;
  saleDate: string;
  quantity: number;
  price: number;
  totalAmount: number;
  remarks: string | null;
  billed: boolean;
}

export interface InvoiceLineItem {
  id: string;
  sourceProductSaleId: string;
  description: string;
  type: "ADDITION" | "DEDUCTION";
  amount: number;
}

export interface InvoicePricing {
  effectiveFatRate: number;
  effectiveSnfRate: number;
  effectiveCommissionRate: number;
  effectiveIncentiveRate: number;
}

export interface InvoiceDetailResponse {
  invoice: BillingInvoice;
  collections: InvoiceCollection[];
  sales: InvoiceSale[];
  lineItems: InvoiceLineItem[];
  pricing: InvoicePricing;
}
