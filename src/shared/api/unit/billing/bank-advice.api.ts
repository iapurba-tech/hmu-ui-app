import { apiClient } from "../../apiClient";
import { API_ENDPOINTS } from "../../endpoints";
import type {
  BankAdvice,
  BankAdviceCreateRequest,
} from "../../../../features/unit-operations/billing/types/bank-advice.types";

export const bankAdviceApi = {
  getAdvices: async (): Promise<BankAdvice[]> => {
    const response = await apiClient.get<BankAdvice[]>(
      API_ENDPOINTS.ADMIN.BILLING.ADVICE.LIST,
    );
    return response.data;
  },

  getAdvice: async (id: string): Promise<BankAdvice> => {
    const response = await apiClient.get<BankAdvice>(
      API_ENDPOINTS.ADMIN.BILLING.ADVICE.DETAIL(id),
    );
    return response.data;
  },

  createAdvice: async (data: BankAdviceCreateRequest): Promise<BankAdvice> => {
    const response = await apiClient.post<BankAdvice>(
      API_ENDPOINTS.ADMIN.BILLING.ADVICE.CREATE,
      data,
    );
    return response.data;
  },

  submitAdvice: async (id: string): Promise<BankAdvice> => {
    const response = await apiClient.post<BankAdvice>(
      API_ENDPOINTS.ADMIN.BILLING.ADVICE.SUBMIT(id),
    );
    return response.data;
  },

  processAdvice: async (id: string): Promise<BankAdvice> => {
    const response = await apiClient.post<BankAdvice>(
      API_ENDPOINTS.ADMIN.BILLING.ADVICE.PROCESS(id),
    );
    return response.data;
  },

  deleteAdvice: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.ADMIN.BILLING.ADVICE.DELETE(id));
  },
};
