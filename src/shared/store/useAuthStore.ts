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
            return { user: null, isAuthenticated: false };
          }
          const activeUnit = state.activeUnit || (user.units.length > 0 ? user.units[0] : null);
          const workspace = state.workspace || (user.role === UserRole.SYSTEM_ADMIN ? 'admin' : 'management');
          
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
