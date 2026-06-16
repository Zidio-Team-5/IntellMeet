import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

let connected = false;

/**
 * Connect to MongoDB. The database is REQUIRED in every environment.
 * There is no in-memory fallback: if the URI is missing or the connection
 * fails, the process throws so the failure is loud and obvious rather than
 * silently serving an app backed by nothing.
 */
export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error(
      "MONGO_URI is not set. A MongoDB connection string is required to start the server. " +
        "Set MONGO_URI in your environment (see .env.example)."
    );
  }
  try {
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    connected = true;
    logger.info(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on("disconnected", () => {
      connected = false;
      logger.warn("MongoDB disconnected.");
    });
    mongoose.connection.on("reconnected", () => {
      connected = true;
      logger.info("MongoDB reconnected.");
    });
  } catch (e) {
    logger.error(`MongoDB connection failed: ${e.message}`);
    throw e; // fail fast — do not start the server without a database
  }
};

export const getDbStatus = () => (connected ? "connected" : "disconnected");
export const generateId = () => new mongoose.Types.ObjectId().toString();