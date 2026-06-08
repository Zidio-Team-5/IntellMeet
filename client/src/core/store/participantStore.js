import { create } from "zustand";

const useParticipantStore = create((set) => ({
  participants: [],
  localStream: null,
  screenStream: null,

  setParticipants: (participants) => set({ participants }),
  addParticipant: (participant) =>
    set((state) => ({
      participants: [...state.participants, participant],
    })),
  removeParticipant: (id) =>
    set((state) => ({
      participants: state.participants.filter(
        (p) => p._id !== id && p.id !== id && p.socketId !== id
      ),
    })),
  updateParticipant: (id, updates) =>
    set((state) => ({
      participants: state.participants.map((p) =>
        p._id === id || p.id === id || p.socketId === id
          ? { ...p, ...updates }
          : p
      ),
    })),
  setLocalStream: (stream) => set({ localStream: stream }),
  setScreenStream: (stream) => set({ screenStream: stream }),
  clearParticipants: () =>
    set({ participants: [], localStream: null, screenStream: null }),
}));

export default useParticipantStore;
