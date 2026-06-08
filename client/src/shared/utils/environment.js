export const isDev = import.meta.env.DEV;
export const isProd = import.meta.env.PROD;
export const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
export const appName = import.meta.env.VITE_APP_NAME || "IntellMeet";
