import { apiClient } from "../../apiClient";
import { API_ENDPOINTS } from "../../endpoints";
import type {
  BillingRun,
  BillingRunCreateRequest,
  BillingInvoice,
  InvoiceDetailResponse,
} from "../../../../features/unit-operations/billing/types/billing.types";

export const billingApi = {
  getRuns: async (): Promise<BillingRun[]> => {
    const response = await apiClient.get<BillingRun[]>(
      API_ENDPOINTS.ADMIN.BILLING.RUNS,
    );
    return response.data;
  },

  getRun: async (id: string): Promise<BillingRun> => {
    const response = await apiClient.get<BillingRun>(
      API_ENDPOINTS.ADMIN.BILLING.DETAIL(id),
    );
    return response.data;
  },

  getInvoices: async (id: string): Promise<BillingInvoice[]> => {
    const response = await apiClient.get<BillingInvoice[]>(
      API_ENDPOINTS.ADMIN.BILLING.INVOICES(id),
    );
    return response.data;
  },

  getInvoiceDetail: async (id: string): Promise<InvoiceDetailResponse> => {
    const response = await apiClient.get<InvoiceDetailResponse>(
      API_ENDPOINTS.ADMIN.BILLING.INVOICE_DETAIL(id),
    );
    return response.data;
  },

  createRun: async (data: BillingRunCreateRequest): Promise<BillingRun> => {
    const response = await apiClient.post<BillingRun>(
      API_ENDPOINTS.ADMIN.BILLING.CREATE_RUN,
      data,
    );
    return response.data;
  },

  deleteRun: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.ADMIN.BILLING.DELETE(id));
  },
};
