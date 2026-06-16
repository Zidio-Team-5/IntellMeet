import * as s from "../services/searchService.js";
import { ok } from "../utils/respond.js";
export const global = async (req, res, next) => { try { ok(res, await s.global(req.body.query)); } catch (e) { next(e); } };
export const knowledge = async (req, res, next) => { try { ok(res, await s.knowledge(req.body.query)); } catch (e) { next(e); } };
