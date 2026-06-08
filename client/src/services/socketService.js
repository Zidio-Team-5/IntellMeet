import { io } from "socket.io-client";
import { socketUrl } from "../shared/utils/environment.js";

let socket = null;

export const connectSocket = (token) => {
  if (socket?.connected) return socket;

  socket = io(socketUrl, {
    auth: { token },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
