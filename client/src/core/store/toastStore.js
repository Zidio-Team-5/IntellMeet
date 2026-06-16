import { create } from "zustand";

let seq = 0;

const useToastStore = create((set) => ({
  toasts: [],
  push: ({ title, message, type = "info", duration = 4500 }) => {
    const id = ++seq;
    set((s) => ({ toasts: [...s.toasts, { id, title, message, type }] }));
    if (duration) setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), duration);
    return id;
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

// Convenience for non-component callers.
export const toast = (payload) => useToastStore.getState().push(payload);
export default useToastStore;
