// Holds the Socket.IO server instance so non-socket code (REST services) can
// push realtime events to a specific user. Each socket joins room `user:<id>`.
let io = null;

export const setIO = (instance) => { io = instance; };

export const emitToUser = (userId, event, payload) => {
  if (!io || !userId) return;
  io.to(`user:${String(userId)}`).emit(event, payload);
};
