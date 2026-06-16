export type BankAdviceStatus = "DRAFT" | "SUBMITTED" | "COMPLETED";

export interface BankAdvice {
  id: string;
  unitId: string;
  billingRunId?: string; // Might be useful to link back
  adviceNumber: string;
  adviceDate: string;
  payoutBankId: string;
  chequeNumber: string;
  chequeDate: string;
  totalAmount: number;
  status: BankAdviceStatus;
}

export interface BankAdviceCreateRequest {
  unitId: string;
  billingRunId: string;
  adviceDate: string;
  payoutBankId: string;
  chequeNumber: string;
  chequeDate: string;
}
