import * as s from "../services/meetingService.js";
import { ok } from "../utils/respond.js";

export const list = async (req, res, next) => { try { ok(res, { meetings: await s.listForUser(req.user.userId) }); } catch (e) { next(e); } };
export const history = async (req, res, next) => { try { ok(res, { meetings: await s.history(req.user.userId) }); } catch (e) { next(e); } };
export const details = async (req, res, next) => { try { ok(res, await s.details(req.params.id)); } catch (e) { next(e); } };
export const create = async (req, res, next) => { try { ok(res, { meeting: await s.create(req.body, req.user.userId) }, 201); } catch (e) { next(e); } };
export const update = async (req, res, next) => { try { ok(res, { meeting: await s.update(req.params.id, req.user.userId, req.body) }); } catch (e) { next(e); } };
export const remove = async (req, res, next) => { try { ok(res, await s.remove(req.params.id, req.user.userId)); } catch (e) { next(e); } };
export const invite = async (req, res, next) => { try { ok(res, { meeting: await s.invite(req.params.id, req.user.userId, req.body.invites ?? req.body.emails ?? req.body.email) }); } catch (e) { next(e); } };
export const join = async (req, res, next) => { try { ok(res, { meeting: await s.join(req.params.id, { userId: req.user.userId, name: req.user.name || req.user.email, email: req.user.email }) }); } catch (e) { next(e); } };
export const leave = async (req, res, next) => { try { ok(res, { meeting: await s.leave(req.params.id, req.user.userId) }); } catch (e) { next(e); } };
export const end = async (req, res, next) => { try { ok(res, { meeting: await s.end(req.params.id, req.user.userId) }); } catch (e) { next(e); } };
export const transcript = async (req, res, next) => { try { ok(res, { transcript: await s.transcript(req.params.id) }); } catch (e) { next(e); } };
export const notes = async (req, res, next) => { try { ok(res, await s.generateNotes(req.params.id, req.user.userId)); } catch (e) { next(e); } };
export const uploadRecording = async (req, res, next) => {
  try {
    if (!req.file) { const e = new Error("No recording file uploaded."); e.status = 400; throw e; }
    const r = await s.saveRecording(req.params.id, req.user.userId, {
      filename: `${req.params.id}-${Date.now()}.webm`,
      mimeType: req.file.mimetype || "video/webm",
      buffer: req.file.buffer,
    });
    ok(res, r);
  } catch (e) { next(e); }
};
