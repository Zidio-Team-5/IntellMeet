import * as s from "../services/analyticsService.js";
import { ok } from "../utils/respond.js";
export const overview = async (_q, res, next) => { try { ok(res, await s.overview()); } catch (e) { next(e); } };
export const productivity = async (_q, res, next) => { try { ok(res, await s.productivity()); } catch (e) { next(e); } };
export const teamPerformance = async (_q, res, next) => { try { ok(res, await s.teamPerformance()); } catch (e) { next(e); } };
export const meetingInsights = async (_q, res, next) => { try { ok(res, await s.meetingInsights()); } catch (e) { next(e); } };
export const knowledge = async (_q, res, next) => { try { ok(res, await s.knowledge()); } catch (e) { next(e); } };
