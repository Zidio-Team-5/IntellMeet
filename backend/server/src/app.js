import express from "express";
import cors from "cors";
import { logger } from "./utils/logger.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import { getDbStatus } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import driveRoutes from "./routes/driveRoutes.js";

export const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000,http://localhost:5173")
  .split(",").map((s) => s.trim()).filter(Boolean);

const app = express();
app.use(cors({
  origin: (origin, cb) => (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) ? cb(null, true) : cb(new Error("CORS blocked")),
  credentials: true,
}));
app.use(express.json({ limit: "5mb" }));
app.use((req, _res, next) => { logger.http(`${req.method} ${req.url}`); next(); });

app.get("/api/health", (_req, res) => res.json({ status: "ok", database: getDbStatus() }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/drive", driveRoutes);

app.all("/api/*", (req, res) => res.status(404).json({ message: `Not found: ${req.method} ${req.originalUrl}` }));
app.use(errorMiddleware);
export default app;
