import { UserRole } from "../constants/roles";

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
    role: UserRole,
    units: UserUnit[],
    address: unknown | null,
    active: boolean,
}

export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
    token: string,
}