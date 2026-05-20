import { UserRole } from "../../../auth/constants/roles";

export interface UserAddress {
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  district: string;
  state: string;
  postalCode: string;
}

export interface UserUnit {
  id: string;
  name: string;
  code?: string;
}

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  role: UserRole;
  mpcsId: string | null;
  units: UserUnit[];
  address: UserAddress;
  active: boolean;
}

export interface CreateUserRequest {
  firstname: string;
  lastname: string;
  username: string;
  password?: string;
  email: string;
  role: UserRole;
  unitIds?: string[];
  mpcsId?: string | null;
  address: UserAddress;
}
