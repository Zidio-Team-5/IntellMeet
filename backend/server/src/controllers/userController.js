import * as userService from "../services/userService.js";
import * as authService from "../services/authService.js";
import { ok } from "../utils/respond.js";

export const list = async (_req, res, next) => { try { ok(res, { users: await userService.listUsers() }); } catch (e) { next(e); } };
export const me = async (req, res, next) => { try { ok(res, { user: await authService.profile(req.user.userId) }); } catch (e) { next(e); } };
export const updateMe = async (req, res, next) => { try { ok(res, { user: await authService.updateProfile(req.user.userId, req.body) }); } catch (e) { next(e); } };
export const settings = async (req, res, next) => { try { ok(res, { user: await authService.updateSettings(req.user.userId, req.body) }); } catch (e) { next(e); } };
export const byId = async (req, res, next) => { try { ok(res, { user: await userService.getUserById(req.params.id) }); } catch (e) { next(e); } };
