
import http from "http";
import dotenv from "dotenv";
dotenv.config();

import app, { allowedOrigins } from "./server/src/app.js";
import { connectDB } from "./server/src/config/db.js";
import { initSockets } from "./server/src/sockets/index.js";
import { logger } from "./server/src/utils/logger.js";

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  const server = http.createServer(app);
  initSockets(server, allowedOrigins);
  server.listen(PORT, () => logger.info(`IntellMeet API on :${PORT}`));
})();
