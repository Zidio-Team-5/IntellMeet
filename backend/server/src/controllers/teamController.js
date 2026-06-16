import * as s from "../services/teamService.js";
import { ok } from "../utils/respond.js";
export const list = async (_q, res, next) => { try { ok(res, await s.members()); } catch (e) { next(e); } };
export const workload = async (_q, res, next) => { try { ok(res, await s.workload()); } catch (e) { next(e); } };
export const presence = async (_q, res, next) => { try { ok(res, await s.presence()); } catch (e) { next(e); } };
export const collaboration = async (_q, res, next) => { try { ok(res, await s.collaboration()); } catch (e) { next(e); } };
