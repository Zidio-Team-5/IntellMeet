import { Router } from "express";
import * as c from "../controllers/taskController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const r = Router();
r.use(authMiddleware);
r.get("/", c.list);
r.post("/", c.create);
r.get("/:id", c.get);
r.put("/:id", c.update);       // frontend uses PUT
r.patch("/:id", c.update);     // accept PATCH too
r.post("/:id/assign", c.assign);
r.delete("/:id", c.remove);
export default r;
