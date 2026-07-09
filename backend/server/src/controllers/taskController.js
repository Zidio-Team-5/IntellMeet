import * as s from "../services/taskService.js";
import { ok } from "../utils/respond.js";

export const list = async (_req, res, next) => { try { ok(res, { tasks: await s.list() }); } catch (e) { next(e); } };
export const get = async (req, res, next) => { try { ok(res, { task: await s.get(req.params.id) }); } catch (e) { next(e); } };
export const create = async (req, res, next) => { try { ok(res, { task: await s.create(req.body) }, 201); } catch (e) { next(e); } };
export const update = async (req, res, next) => { try { ok(res, { task: await s.update(req.params.id, req.body) }); } catch (e) { next(e); } };
export const assign = async (req, res, next) => { try { ok(res, { task: await s.assign(req.params.id, req.body) }); } catch (e) { next(e); } };
export const remove = async (req, res, next) => { try { ok(res, await s.remove(req.params.id)); } catch (e) { next(e); } };
