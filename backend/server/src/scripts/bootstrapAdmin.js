/**
 * Creates (or updates) ONLY the demo admin account. Safe to run once against
 * production — unlike scripts/seed.js, this never touches meetings, tasks,
 * or notifications.
 *
 * Usage:  node server/src/scripts/bootstrapAdmin.js
 * Env:    DEMO_ADMIN_NAME (optional, default "Admin")
 *         DEMO_ADMIN_EMAIL (optional, default "admin@intellmeet.app")
 *         DEMO_ADMIN_PASSWORD (required — pick a real password, not the default)
 */
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { logger } from "../utils/logger.js";

const run = async () => {
  const name = process.env.DEMO_ADMIN_NAME || "Admin";
  const email = (process.env.DEMO_ADMIN_EMAIL || "admin@intellmeet.app").toLowerCase();
  const password = process.env.DEMO_ADMIN_PASSWORD;

  if (!password) {
    logger.error("Set DEMO_ADMIN_PASSWORD before running this script.");
    process.exit(1);
  }

  await connectDB();
  const hashed = await bcrypt.hash(password, 10);
  const doc = await User.findOneAndUpdate(
    { email },
    {
      name, email, password: hashed, role: "admin",
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      isVerified: true, hasPassword: true,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  logger.info(`Demo admin ready: ${doc.email} (role: ${doc.role})`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((e) => {
  logger.error(`Bootstrap failed: ${e.message}`);
  process.exit(1);
});
