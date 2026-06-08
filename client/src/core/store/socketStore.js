import { create } from "zustand";

const useSocketStore = create((set) => ({
  socket: null,
  connected: false,
  roomId: null,

  setSocket: (socket) => set({ socket }),
  setConnected: (connected) => set({ connected }),
  setRoomId: (roomId) => set({ roomId }),
  clearSocket: () => set({ socket: null, connected: false, roomId: null }),
}));

export default useSocketStore;
