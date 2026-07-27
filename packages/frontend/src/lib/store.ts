import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  plan: string;
  messageLimit: number;
  messagesUsed: number;
}

interface AppState {
  user: User | null;
  sidebarOpen: boolean;
  setUser: (user: User | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  sidebarOpen: true,
  setUser: (user) => set({ user }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
