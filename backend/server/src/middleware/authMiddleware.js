import { verifyToken } from "../utils/jwt.js";
import { fail } from "../utils/respond.js";

// Reads "Authorization: Bearer <token>" (frontend sends state.token here).
export const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return fail(res, "Not authenticated.", 401);
  try {
    req.user = verifyToken(header.slice(7).trim());
    next();
  } catch {
    return fail(res, "Invalid or expired token.", 401);
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return fail(res, "Forbidden.", 403);
  next();
};
