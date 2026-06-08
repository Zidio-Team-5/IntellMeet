const LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
const isDev = import.meta.env.DEV;

class Logger {
  constructor(level = "info") {
    this.level = LOG_LEVELS[level] ?? 1;
  }

  debug(message, ...args) {
    if (this.level <= LOG_LEVELS.debug && isDev) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  info(message, ...args) {
    if (this.level <= LOG_LEVELS.info) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  warn(message, ...args) {
    if (this.level <= LOG_LEVELS.warn) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  error(message, ...args) {
    if (this.level <= LOG_LEVELS.error) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }
}

export const logger = new Logger(isDev ? "debug" : "warn");
export default logger;
