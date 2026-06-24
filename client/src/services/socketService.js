import { io } from "socket.io-client";
import { socketUrl } from "../shared/utils/environment.js";

let socket = null;

export const connectSocket = (token) => {
  // Reuse the existing singleton (even if mid-connect) so we never spawn a
  // second socket with its own listeners.
  if (socket) {
    if (!socket.connected && !socket.active) socket.connect();
    return socket;
  }

  socket = io(socketUrl, {
    auth: { token },
    // Allow the polling fallback: many hosting proxies (Render, etc.) reject a
    // WebSocket-only handshake, which would otherwise leave the client stuck
    // "connecting" forever. Socket.IO upgrades to WebSocket when possible.
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    timeout: 10000,
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
