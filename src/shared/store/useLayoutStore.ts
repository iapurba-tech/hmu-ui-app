import { create } from 'zustand';

export type PortalType = 'admin' | 'management';

interface LayoutState {
  isSidebarOpen: boolean;
  portal: PortalType;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setPortal: (portal: PortalType) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  isSidebarOpen: true, // Desktop default
  portal: 'management', // Default to management as per user's current focus
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ isSidebarOpen: open }),
  setPortal: (portal: PortalType) => set({ portal }),
}));
