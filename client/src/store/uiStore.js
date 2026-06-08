import { create } from "zustand";

const useUIStore = create((set) => ({
  sidebarOpen: true,
  modalStack: [],

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  pushModal: (modal) => set((s) => ({ modalStack: [...s.modalStack, modal] })),
  popModal: () => set((s) => ({ modalStack: s.modalStack.slice(0, -1) })),
  clearModals: () => set({ modalStack: [] }),
}));

export default useUIStore;
