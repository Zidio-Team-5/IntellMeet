export const isDev = import.meta.env.DEV;
export const isProd = import.meta.env.PROD;
export const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// The Socket.IO server lives at the API host WITHOUT the "/api" path. If
// VITE_SOCKET_URL isn't provided, derive it from VITE_API_URL so a deployment
// that only sets the API URL still connects its WebSocket to the right origin
// (instead of falling back to localhost, which silently fails in production).
const deriveSocketUrl = (api) => api.replace(/\/api\/?$/, "");
export const socketUrl = import.meta.env.VITE_SOCKET_URL || deriveSocketUrl(apiUrl);

export const appName = import.meta.env.VITE_APP_NAME || "IntellMeet";
