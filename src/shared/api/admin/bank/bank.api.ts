import type {
  Bank,
  CreateBankRequest,
  UpdateBankRequest,
} from "../../../../features/admin/banks/types/bank.types";
import { apiClient } from "../../apiClient";
import { API_ENDPOINTS } from "../../endpoints";

export const bankApi = {
  getAllBankAccounts: async (params?: { unitId?: string }): Promise<Bank[]> => {
    const response = await apiClient.get<Bank[]>(
      API_ENDPOINTS.ADMIN.BANK_ACCOUNT.LIST,
      { params }
    );
    return response.data;
  },

  getBankAccount: async (id: string): Promise<Bank> => {
    const response = await apiClient.get<Bank>(
      API_ENDPOINTS.ADMIN.BANK_ACCOUNT.DETAIL(id),
    );
    return response.data;
  },

  createBankAccount: async (data: CreateBankRequest): Promise<Bank> => {
    const response = await apiClient.post<Bank>(
      API_ENDPOINTS.ADMIN.BANK_ACCOUNT.CREATE,
      data,
    );
    return response.data;
  },

  updateBankAccount: async ({
    id,
    ...data
  }: UpdateBankRequest): Promise<Bank> => {
    const response = await apiClient.put<Bank>(
      API_ENDPOINTS.ADMIN.BANK_ACCOUNT.UPDATE(id),
      data,
    );
    return response.data;
  },

  deleteBankAccount: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.ADMIN.BANK_ACCOUNT.DELETE(id));
  },
};
