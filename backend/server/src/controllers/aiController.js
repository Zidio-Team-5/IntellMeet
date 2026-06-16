import * as ai from "../services/aiService.js";
import { ok } from "../utils/respond.js";

export const summary = async (req, res, next) => { try { const r = await ai.summarize(req.body.transcript || ""); ok(res, { summary: r.summary, actionItems: r.actionItems }); } catch (e) { next(e); } };
export const actionItems = async (req, res, next) => { try { const r = await ai.summarize(req.body.transcript || ""); ok(res, { actionItems: r.actionItems }); } catch (e) { next(e); } };
export const chat = async (req, res, next) => { try { ok(res, await ai.chat(req.body.message, req.body.context)); } catch (e) { next(e); } };
export const search = async (req, res, next) => { try { const { knowledge } = await import("../services/searchService.js"); ok(res, await knowledge(req.body.query)); } catch (e) { next(e); } };
export const templates = async (_req, res, next) => { try { ok(res, { templates: ai.templates() }); } catch (e) { next(e); } };
export const history = async (req, res, next) => { try { const { Meeting } = await import("../models/Meeting.js"); const ms = await Meeting.find({ host: req.user.userId }); ok(res, { history: ms.filter((m) => m.summary).map((m) => ({ _id: String(m._id), title: m.title, summary: m.summary })) }); } catch (e) { next(e); } };
