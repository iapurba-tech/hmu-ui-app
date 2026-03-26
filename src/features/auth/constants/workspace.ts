export const WorkspaceType = {
  SYSTEM_ADMIN: "system_admin",
  UNIT_MANAGEMENT: "unit_management",
} as const;

export type WorkspaceType = (typeof WorkspaceType)[keyof typeof WorkspaceType];
