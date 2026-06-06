export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    ME: "/api/v1/me",
  },
  ADMIN: {
    UNIT: {
      LIST: "/api/v1/admin/units",
      CREATE: "/api/v1/admin/units",
      ACTIVATE: (id: string) => `/api/v1/admin/units/${id}/activate`,
      DEACTIVATE: (id: string) => `/api/v1/admin/units/${id}/deactivate`,
    },
    USER: {
      LIST: "/api/v1/users",
      CREATE: "/api/v1/users",
      UPDATE: (id: string) => `/api/v1/users/${id}`,
      ACTIVATE: (id: string) => `/api/v1/users/${id}/activate`,
      DEACTIVATE: (id: string) => `/api/v1/users/${id}/deactivate`,
      PERMANENT: (id: string) => `/api/v1/users/${id}/permanent`,
    },
    BANK_ACCOUNT: {
      LIST: "/api/v1/admin/bank-accounts",
      CREATE: "/api/v1/admin/bank-accounts",
      UPDATE: (id: string) => `/api/v1/admin/bank-accounts/${id}`,
      DETAIL: (id: string) => `/api/v1/admin/bank-accounts/${id}`,
      DELETE: (id: string) => `/api/v1/admin/bank-accounts/${id}`,
    },
    PRODUCT: {
      LIST: "/api/v1/products",
      CREATE: "/api/v1/products",
      UPDATE: (id: string) => `/api/v1/products/${id}`,
      DETAIL: (id: string) => `/api/v1/products/${id}`,
      DELETE: (id: string) => `/api/v1/products/${id}`,
    },
    MPCS: {
      LIST: "/api/v1/mpcs",
      CREATE: "/api/v1/mpcs",
      DETAIL: (id: string) => `/api/v1/mpcs/${id}`,
      UPDATE_DETAILS: (id: string) => `/api/v1/mpcs/${id}/details`,
      UPDATE_CONFIGURATION: (id: string) => `/api/v1/mpcs/${id}/configuration`,
      DELETE: (id: string) => `/api/v1/mpcs/${id}`,
    },
  },
  PRICING: {
    HEAD_LOAD_CATEGORY: {
      LIST: "/api/v1/pricing/head-load-categories",
      CREATE: "/api/v1/pricing/head-load-categories",
      UPDATE: (id: number) => `/api/v1/pricing/head-load-categories/${id}`,
      DELETE: (id: number) => `/api/v1/pricing/head-load-categories/${id}`,
    },
    HEAD_LOAD: {
      LIST: "/api/v1/pricing/head-load",
      BY_CATEGORY: (id: number) => `/api/v1/pricing/head-load/${id}`,
    },
    RULE: {
      LIST: (ruleType: string) => `/api/v1/pricing/${ruleType}`,
      CREATE: "/api/v1/pricing",
    },
  },
};
