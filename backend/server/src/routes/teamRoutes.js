import { Router } from "express";
import * as c from "../controllers/teamController.js";
import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";
const r = Router();
r.use(authMiddleware);
r.get("/", c.list);
r.get("/workload", c.workload);
r.get("/presence", c.presence);
r.get("/collaboration", c.collaboration);
// Admin-only management
r.post("/", requireRole("admin"), c.addMember);
r.post("/:id/promote", requireRole("admin"), c.promote);
r.post("/:id/demote", requireRole("admin"), c.demote);
r.delete("/:id", requireRole("admin"), c.removeMember);
export default r;
