/**
 * Seed script — creates a small, predictable dataset for local testing.
 *
 * Usage:  npm run seed
 *
 * Requires MONGO_URI in the environment (same as the server). It is idempotent
 * for users (upserts by email) and replaces the sample meetings/tasks/
 * notifications it owns so you can re-run it freely.
 */
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Meeting } from "../models/Meeting.js";
import { Task } from "../models/Task.js";
import { Notification } from "../models/Notification.js";
import { logger } from "../utils/logger.js";

const avatar = (name) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

const USERS = [
  {
    name: process.env.DEMO_ADMIN_NAME || "Alice Admin",
    email: (process.env.DEMO_ADMIN_EMAIL || "alice@intellmeet.test").toLowerCase(),
    password: process.env.DEMO_ADMIN_PASSWORD || "password123",
    role: "admin", department: "Leadership",
  },
  { name: "Bob Builder", email: "bob@intellmeet.test", password: "password123", role: "member", department: "Engineering" },
  { name: "Carol Chen", email: "carol@intellmeet.test", password: "password123", role: "member", department: "Design" },
];

const run = async () => {
  await connectDB();

  // --- Users (upsert by email) ---
  const userIds = {};
  for (const u of USERS) {
    const hashed = await bcrypt.hash(u.password, 10);
    const doc = await User.findOneAndUpdate(
      { email: u.email },
      { name: u.name, email: u.email, password: hashed, role: u.role, department: u.department, avatar: avatar(u.name), isVerified: true, hasPassword: true },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    userIds[u.email] = String(doc._id);
    logger.info(`User ready: ${u.email} (${u.role})`);
  }
  const alice = userIds["alice@intellmeet.test"];
  const bob = userIds["bob@intellmeet.test"];
  const carol = userIds["carol@intellmeet.test"];
  const member = (id, name, email, role = "member") => ({ userId: id, name, email, role });

  // --- Reset sample meetings/tasks/notifications hosted by Alice ---
  await Meeting.deleteMany({ host: alice });
  await Task.deleteMany({ meetingId: "seed" });
  await Notification.deleteMany({ userId: alice });

  const m1 = await Meeting.create({
    title: "Q3 Roadmap Planning",
    description: "Lock the Q3 priorities and owners.",
    roomId: "qcr-pla-nng",
    host: alice,
    creator: alice,
    members: [
      member(alice, "Alice Admin", "alice@intellmeet.test", "host"),
      member(bob, "Bob Builder", "bob@intellmeet.test"),
    ],
    participants: [
      { userId: alice, name: "Alice Admin", email: "alice@intellmeet.test", joinedAt: new Date() },
      { userId: bob, name: "Bob Builder", email: "bob@intellmeet.test", joinedAt: new Date() },
    ],
    invitedUsers: [],
    visibility: "invite",
    status: "completed",
    duration: 60,
    transcript: [
      { senderName: "Alice Admin", message: "Let's lock the Q3 priorities today.", timestamp: new Date() },
      { senderName: "Bob Builder", message: "I'll own the auth hardening track.", timestamp: new Date() },
    ],
    summary: "Team aligned on Q3 priorities. Bob owns auth hardening; Carol owns the design system refresh.",
    isActive: false,
  });

  // A LIVE meeting where Carol is INVITED but has not joined — demonstrates
  // cross-user visibility (Carol sees it on her dashboard without joining).
  await Meeting.create({
    title: "Daily Standup",
    description: "Quick sync.",
    roomId: "std-dly-now",
    host: alice,
    creator: alice,
    members: [member(alice, "Alice Admin", "alice@intellmeet.test", "host")],
    participants: [{ userId: alice, name: "Alice Admin", email: "alice@intellmeet.test", joinedAt: new Date() }],
    invitedUsers: [{ userId: carol, name: "Carol Chen", email: "carol@intellmeet.test", status: "pending", invitedAt: new Date() }],
    visibility: "invite",
    status: "live",
    duration: 15,
    transcript: [],
    summary: "",
    isActive: true,
  });

  // An UPCOMING (scheduled) meeting — populates the "Upcoming" filter/widget.
  await Meeting.create({
    title: "Sprint Review",
    description: "Demo and retro.",
    roomId: "spr-rev-iew",
    host: alice,
    creator: alice,
    members: [
      member(alice, "Alice Admin", "alice@intellmeet.test", "host"),
      member(bob, "Bob Builder", "bob@intellmeet.test"),
    ],
    participants: [],
    invitedUsers: [{ userId: bob, name: "Bob Builder", email: "bob@intellmeet.test", status: "pending", invitedAt: new Date() }],
    visibility: "invite",
    status: "upcoming",
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    duration: 45,
    transcript: [],
    summary: "",
    isActive: false,
  });

  await Task.create([
    { meetingId: "seed", title: "Harden authentication", description: "Fail-fast on missing JWT secret.", assignee: "Bob Builder", priority: "high", status: "in_progress" },
    { meetingId: "seed", title: "Refresh design tokens", description: "Update the shared UI palette.", assignee: "Carol Chen", priority: "medium", status: "todo" },
    { meetingId: "seed", title: "Publish Q3 summary", description: "Share the roadmap recap.", assignee: "Alice Admin", priority: "low", status: "completed" },
  ]);

  await Notification.create([
    { userId: alice, type: "meeting", message: "Q3 Roadmap Planning summary is ready.", read: false },
    { userId: alice, type: "task", message: "Bob moved 'Harden authentication' to In Progress.", read: false },
  ]);

  logger.info(`Seeded: ${USERS.length} users, 3 meetings, 3 tasks, 2 notifications.`);
  logger.info(`Login with: ${USERS[0].email} / ${USERS[0].password}  (admin)`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((e) => {
  logger.error(`Seed failed: ${e.message}`);
  process.exit(1);
});