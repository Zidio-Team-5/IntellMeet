import * as s from "../services/notificationService.js";
import { ok } from "../utils/respond.js";
export const list = async (req, res, next) => { try { ok(res, await s.list(req.user.userId)); } catch (e) { next(e); } };
export const markRead = async (req, res, next) => { try { ok(res, { notification: await s.markRead(req.user.userId, req.params.id) }); } catch (e) { next(e); } };
export const markAllRead = async (req, res, next) => { try { ok(res, await s.markAllRead(req.user.userId)); } catch (e) { next(e); } };
export const remove = async (req, res, next) => { try { ok(res, await s.remove(req.user.userId, req.params.id)); } catch (e) { next(e); } };
