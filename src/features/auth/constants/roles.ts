export const UserRole = {
  SYSTEM_ADMIN: "ROLE_SYSTEM_ADMIN",
  UNIT_ADMIN: "ROLE_UNIT_ADMIN",
  UNIT_MANAGER: "ROLE_UNIT_MANAGER",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UNIT_OPERATIONS_ROLES = [
  UserRole.SYSTEM_ADMIN,
  UserRole.UNIT_ADMIN,
  UserRole.UNIT_MANAGER,
];

export const SYSTEM_ADMINISTRATOR_ROLES = [UserRole.SYSTEM_ADMIN];
