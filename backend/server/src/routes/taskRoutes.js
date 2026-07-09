import { Router } from "express";
import * as c from "../controllers/taskController.js";
import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";
const r = Router();
r.use(authMiddleware);
r.get("/", c.list);
r.get("/:id", c.get);
// Creation and assignment are admin actions.
r.post("/", requireRole("admin"), c.create);
r.put("/:id", c.update);       // frontend uses PUT (status moves stay open to any member)
r.patch("/:id", c.update);     // accept PATCH too
r.post("/:id/assign", requireRole("admin"), c.assign);
r.delete("/:id", requireRole("admin"), c.remove);
export default r;
