export type AccountType = "SAVINGS" | "CURRENT";

export interface Bank {
  id: string;
  unit: {
    id: string;
    code: string;
    name: string;
    active: boolean;
  };
  code: string;
  bankName: string;
  accountNumber: string;
  accountType: AccountType;
  accountHolderName: string;
  ifsc: string;
  branchName: string;
  micr: string;
  contactNumber: string;
  contactEmail: string;
}

export interface CreateBankRequest {
  unitId: string;
  bankName: string;
  accountNumber: string;
  accountType: AccountType;
  accountHolderName: string;
  ifsc: string;
  branchName: string;
  micr: string;
  contactNumber: string;
  contactEmail: string;
}

export type UpdateBankRequest = Partial<CreateBankRequest> & { id: string };
