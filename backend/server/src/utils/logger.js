const ts = () => new Date().toISOString();
export const logger = {
  info: (m) => console.log(`[INFO ${ts()}] ${m}`),
  warn: (m) => console.warn(`[WARN ${ts()}] ${m}`),
  error: (m) => console.error(`[ERROR ${ts()}] ${m}`),
  debug: (m) => process.env.NODE_ENV !== "production" && console.debug(`[DEBUG ${ts()}] ${m}`),
  http: (m) => console.log(`[HTTP ${ts()}] ${m}`),
};
