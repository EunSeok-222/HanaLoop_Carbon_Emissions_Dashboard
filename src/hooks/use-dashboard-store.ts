import { create } from 'zustand';

interface DashboardState {
  filter: string | null;
  isSidebarOpen: boolean;
  setFilter: (filter: string | null) => void;
  toggleSidebar: () => void;
}

/**
 * Dashboard 전역 상태 관리 (Zustand)
 * 클라이언트 사이드 인터랙션을 위한 상태를 관리합니다.
 */
export const useDashboardStore = create<DashboardState>((set) => ({
  filter: 'all',
  isSidebarOpen: true,
  setFilter: (filter) => set({ filter }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
