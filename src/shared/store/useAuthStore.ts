import { create } from "zustand";
import type {
  UserProfile,
  UserUnit,
} from "../../features/auth/types/auth.types";
import { persist } from "zustand/middleware";

export type PortalType = "admin" | "management";

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  activeUnit: UserUnit | null;
  portal: PortalType;
  isAuthenticated: boolean;
  isInitializing: boolean;
  //Actions
  setToken: (token: string) => void;
  setUser: (user: UserProfile) => void;
  setActiveUnit: (unit: UserUnit | null) => void;
  setPortal: (portal: PortalType) => void;
  logout: () => void;
  setInitializing: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      activeUnit: null,
      portal: "management",
      isAuthenticated: false,
      isInitializing: true,

      setToken: (token) => set({ token }),

      setUser: (user) =>
        set((state) => {
          const activeUnit = state.activeUnit || (user.units.length === 1 ? user.units[0] : null);
          const portal = state.portal || (user.role === 'ROLE_SYSTEM_ADMIN' ? 'admin' : 'management');
          
          return {
            user,
            isAuthenticated: true,
            activeUnit,
            portal,
          };
        }),

      setActiveUnit: (unit) => set({ activeUnit: unit }),

      setPortal: (portal) => set({ portal }),

      logout: () =>
        set({
          token: null,
          user: null,
          activeUnit: null,
          portal: "management",
          isAuthenticated: false,
        }),

      setInitializing: (status) => set({ isInitializing: status }),
    }),
    {
      name: "hmu-auth-storage",
      // We only want to persist the token and the selected unit/portal.
      // We should NOT persist the user profile, we should fetch it fresh on reload.
      partialize: (state) => ({
        token: state.token,
        activeUnit: state.activeUnit,
        portal: state.portal,
      }),
    },
  ),
);
