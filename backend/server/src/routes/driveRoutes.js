import { Router } from "express";
import * as c from "../controllers/driveController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const r = Router();
// Plain browser navigations - token passed as query param, verified manually inside.
r.get("/connect", c.connect);
r.get("/oauth/callback", c.callback);
// Normal authenticated API calls.
r.get("/status", authMiddleware, c.status);
r.post("/disconnect", authMiddleware, c.disconnect);
export default r;
