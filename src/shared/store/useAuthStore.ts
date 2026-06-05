import { create } from "zustand";
import { UserRole } from "../../features/auth/constants/roles";
import type {
  UserProfile,
  UserUnit,
} from "../../features/auth/types/auth.types";
import { persist } from "zustand/middleware";
import { WorkspaceType } from "../../features/auth/constants/workspace";

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  activeUnit: UserUnit | null;
  workspace: WorkspaceType;
  isAuthenticated: boolean;
  isInitializing: boolean;
  //Actions
  setToken: (token: string | null) => void;
  setUser: (user: UserProfile | null) => void;
  setActiveUnit: (unit: UserUnit | null) => void;
  setWorkspace: (workspace: WorkspaceType) => void;
  logout: () => void;
  setInitializing: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      activeUnit: null,
      workspace: WorkspaceType.UNIT_MANAGEMENT,
      isAuthenticated: false,
      isInitializing: true,

      setToken: (token) => set({ token, isAuthenticated: !!token }),

      setUser: (user) =>
        set((state) => {
          if (!user) {
            return {
              user: null,
              isAuthenticated: false,
              activeUnit: null,
              workspace: WorkspaceType.UNIT_MANAGEMENT,
            };
          }

          const isSystemAdmin = user.role === UserRole.SYSTEM_ADMIN;

          // 1. Determine Workspace
          let workspace = state.workspace;

          // If it's a new session (default workspace) and user is System Admin, default to System Admin workspace
          if (
            state.workspace === WorkspaceType.UNIT_MANAGEMENT &&
            !state.activeUnit &&
            isSystemAdmin
          ) {
            workspace = WorkspaceType.SYSTEM_ADMIN;
          }

          // If user is NOT System Admin, they MUST be in Unit Management
          if (!isSystemAdmin) {
            workspace = WorkspaceType.UNIT_MANAGEMENT;
          }

          // 2. Determine Active Unit
          let activeUnit = state.activeUnit;

          // If in Unit Management and no unit is selected, pick the first one from user's units
          if (
            workspace === WorkspaceType.UNIT_MANAGEMENT &&
            !activeUnit &&
            user.units.length > 0
          ) {
            activeUnit = user.units[0];
          }

          // If in System Admin workspace, active unit should be null (Global)
          if (workspace === WorkspaceType.SYSTEM_ADMIN) {
            activeUnit = null;
          }

          return {
            user,
            isAuthenticated: true,
            activeUnit,
            workspace,
          };
        }),

      setActiveUnit: (unit) => set({ activeUnit: unit }),

      setWorkspace: (workspace) => set({ workspace }),

      logout: () =>
        set({
          token: null,
          user: null,
          activeUnit: null,
          workspace: WorkspaceType.UNIT_MANAGEMENT,
          isAuthenticated: false,
        }),

      setInitializing: (status) => set({ isInitializing: status }),
    }),
    {
      name: "hmu-auth-storage",
      // We only want to persist the token and the selected unit/workspace.
      // We should NOT persist the user profile, we should fetch it fresh on reload.
      partialize: (state) => ({
        token: state.token,
        activeUnit: state.activeUnit,
        workspace: state.workspace,
      }),
    },
  ),
);
