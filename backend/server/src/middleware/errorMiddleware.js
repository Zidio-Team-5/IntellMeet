import { logger } from "../utils/logger.js";
import { fail } from "../utils/respond.js";

export const errorMiddleware = (err, req, res, _next) => {
  logger.error(`[${req.method}] ${req.originalUrl} -> ${err.message || err}`);
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return fail(res, `${field} already in use.`, 400);
  }
  if (err.name === "ValidationError") return fail(res, "Validation failed.", 400);
  const status = err.status || 500;
  // 4xx messages are meaningful to the client; only mask true 5xx in prod.
  const message = status >= 500 && process.env.NODE_ENV === "production" ? "Internal server error." : err.message || "Error";
  return fail(res, message, status);
};
