import * as s from "../services/dashboardService.js";
import { ok } from "../utils/respond.js";
export const stats = async (req, res, next) => { try { ok(res, await s.stats(req.user.userId)); } catch (e) { next(e); } };
export const activity = async (req, res, next) => { try { ok(res, await s.activity(req.user.userId)); } catch (e) { next(e); } };
export const insights = async (req, res, next) => { try { ok(res, await s.insights(req.user.userId)); } catch (e) { next(e); } };
export const upcoming = async (req, res, next) => { try { ok(res, await s.upcoming(req.user.userId)); } catch (e) { next(e); } };
