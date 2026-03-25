export interface UserUnit {
    id: string,
    name: string,
    code: string,
    status?: 'active' | 'inactive',
    mpcsUnits?: number,
    dailyVolume?: string,
}

export interface UserProfile {
    id: string,
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    role: "ROLE_SYSTEM_ADMIN" | "ROLE_UNIT_ADMIN" | "ROLE_UNIT_MANAGER",
    units: UserUnit[],
    address: unknown | null,
    active: boolean,
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
    token: string,
}