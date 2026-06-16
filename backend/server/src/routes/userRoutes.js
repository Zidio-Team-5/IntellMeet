import { Router } from "express";
import * as c from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const r = Router();
r.use(authMiddleware);
r.get("/profile", c.me);     // static before dynamic /:id
r.put("/profile", c.updateMe);
r.put("/settings", c.settings);
r.get("/", c.list);
r.get("/:id", c.byId);
export default r;
