import { create } from "zustand";

const useMeetingStore = create((set, get) => ({
  activeMeeting: null,
  meetings: [],
  isLoading: false,
  error: null,

  setActiveMeeting: (meeting) => set({ activeMeeting: meeting }),
  clearActiveMeeting: () => set({ activeMeeting: null }),
  setMeetings: (meetings) => set({ meetings }),
  addMeeting: (meeting) =>
    set((state) => ({ meetings: [meeting, ...state.meetings] })),
  updateMeeting: (id, updates) =>
    set((state) => ({
      meetings: state.meetings.map((m) =>
        m._id === id || m.id === id ? { ...m, ...updates } : m
      ),
    })),
  removeMeeting: (id) =>
    set((state) => ({
      meetings: state.meetings.filter((m) => m._id !== id && m.id !== id),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  getMeetingById: (id) =>
    get().meetings.find((m) => m._id === id || m.id === id),
}));

export default useMeetingStore;
