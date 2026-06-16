import { Router } from "express";
import * as c from "../controllers/notificationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const r = Router();
r.use(authMiddleware);
r.get("/", c.list);
r.patch("/read-all", c.markAllRead);  // before /:id/read
r.patch("/:id/read", c.markRead);
r.delete("/:id", c.remove);
export default r;
