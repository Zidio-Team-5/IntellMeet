import { Router } from "express";
import * as c from "../controllers/meetingController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const r = Router();
r.use(authMiddleware);
r.get("/history", c.history); // before /:id
r.get("/", c.list);
r.post("/", c.create);
r.get("/:id", c.details);
r.post("/:id/join", c.join);
r.post("/:id/leave", c.leave);
r.post("/:id/end", c.end);
r.get("/:id/transcript", c.transcript);
export default r;
