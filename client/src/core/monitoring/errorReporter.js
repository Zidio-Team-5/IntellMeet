import logger from "./logger.js";

class ErrorReporter {
  report(error, context = {}) {
    logger.error("Application error:", error.message, { context, stack: error.stack });
    // In production, send to monitoring service (e.g., Sentry)
    if (!import.meta.env.DEV) {
      // window.Sentry?.captureException(error, { extra: context });
    }
  }

  warn(message, context = {}) {
    logger.warn(message, context);
  }
}

export const errorReporter = new ErrorReporter();
export default errorReporter;
