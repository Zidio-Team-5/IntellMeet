const appConfig = {
  appName: "IntellMeet",
  version: "2.0.0",
  apiBaseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  socketUrl: import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
  enableAI: true,
  enableNotifications: true,
  enableAnalytics: true,
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
  },
  meeting: {
    maxParticipants: 50,
    recordingEnabled: true,
    screenShareEnabled: true,
  },
  queryStaleTime: 5 * 60 * 1000,
  queryRetries: 2,
};

export default appConfig;
