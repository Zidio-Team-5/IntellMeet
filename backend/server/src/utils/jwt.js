import jwt from "jsonwebtoken";
import { logger } from "./logger.js";

const DEV_FALLBACK = "dev-only-insecure-secret-change-me";

const resolveSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (secret && secret.trim()) return secret;
  if (process.env.NODE_ENV === "production") {
    // Never run production with a guessable signing key.
    throw new Error("JWT_SECRET is not set. Refusing to start in production without a signing secret.");
  }
  logger.warn("JWT_SECRET not set — using an insecure development fallback. Do NOT use this in production.");
  return DEV_FALLBACK;
};

const getSecret = () => resolveSecret();
const getTTL = () => process.env.JWT_TTL || "7d";

export const signToken = (user) =>
  jwt.sign(
    {
      userId: String(user._id || user.id),
      email: user.email,
      role: user.role,
      name: user.name,
    },
    getSecret(),
    {
      expiresIn: getTTL(),
    }
  );

export const verifyToken = (token) =>
  jwt.verify(token, getSecret());