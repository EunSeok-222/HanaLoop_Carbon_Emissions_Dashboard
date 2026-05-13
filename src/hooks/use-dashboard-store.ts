import { create } from 'zustand';

interface DashboardState {
  language: 'ko' | 'en';
  filter: string | null;
  isSidebarOpen: boolean;
  setLanguage: (lang: 'ko' | 'en') => void;
  setFilter: (filter: string | null) => void;
  toggleSidebar: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  language: 'ko',
  filter: 'all',
  isSidebarOpen: true,
  setLanguage: (language) => set({ language }),
  setFilter: (filter) => set({ filter }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
