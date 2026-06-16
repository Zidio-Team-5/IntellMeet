import * as s from "../services/meetingService.js";
import { ok } from "../utils/respond.js";

export const list = async (req, res, next) => { try { ok(res, { meetings: await s.listForUser(req.user.userId) }); } catch (e) { next(e); } };
export const history = async (req, res, next) => { try { ok(res, { meetings: await s.history(req.user.userId) }); } catch (e) { next(e); } };
export const details = async (req, res, next) => { try { ok(res, await s.details(req.params.id)); } catch (e) { next(e); } };
export const create = async (req, res, next) => { try { ok(res, { meeting: await s.create(req.body.title, req.user.userId) }, 201); } catch (e) { next(e); } };
export const join = async (req, res, next) => { try { ok(res, { meeting: await s.join(req.params.id, { userId: req.user.userId, name: req.user.name || req.user.email, email: req.user.email }) }); } catch (e) { next(e); } };
export const leave = async (req, res, next) => { try { ok(res, { meeting: await s.leave(req.params.id, req.user.userId) }); } catch (e) { next(e); } };
export const end = async (req, res, next) => { try { ok(res, { meeting: await s.end(req.params.id) }); } catch (e) { next(e); } };
export const transcript = async (req, res, next) => { try { ok(res, { transcript: await s.transcript(req.params.id) }); } catch (e) { next(e); } };
