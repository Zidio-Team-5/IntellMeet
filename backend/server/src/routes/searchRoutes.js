import { Router } from "express";
import * as c from "../controllers/searchController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const r = Router();
r.use(authMiddleware);
r.post("/global", c.global);
r.post("/knowledge", c.knowledge);
export default r;
