import { create } from "zustand";

const useTeamStore = create((set) => ({
  members: [],
  onlineMembers: new Set(),
  workload: [],

  setMembers: (members) => set({ members }),
  setMemberOnline: (id) =>
    set((state) => ({
      onlineMembers: new Set([...state.onlineMembers, id]),
    })),
  setMemberOffline: (id) =>
    set((state) => {
      const updated = new Set(state.onlineMembers);
      updated.delete(id);
      return { onlineMembers: updated };
    }),
  setWorkload: (workload) => set({ workload }),
}));

export default useTeamStore;
