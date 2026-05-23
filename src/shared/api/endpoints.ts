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
    }
}