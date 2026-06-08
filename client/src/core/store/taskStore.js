import { create } from "zustand";

const useTaskStore = create((set) => ({
  tasks: [],
  filter: "all",
  isLoading: false,

  setTasks: (tasks) => set({ tasks }),
  setFilter: (filter) => set({ filter }),
  addTask: (task) =>
    set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t._id === id || t.id === id ? { ...t, ...updates } : t
      ),
    })),
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t._id !== id && t.id !== id),
    })),
  moveTask: (id, newStatus) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t._id === id || t.id === id ? { ...t, status: newStatus } : t
      ),
    })),
  setLoading: (isLoading) => set({ isLoading }),
}));

export default useTaskStore;
