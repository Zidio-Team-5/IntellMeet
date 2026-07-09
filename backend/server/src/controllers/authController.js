import * as authService from "../services/authService.js";
import { ok } from "../utils/respond.js";

export const register = async (req, res, next) => { try { const r = await authService.register(req.body); ok(res, r, 201); } catch (e) { next(e); } };
export const resendOtp = async (req, res, next) => { try { ok(res, await authService.resendOtp(req.body)); } catch (e) { next(e); } };
export const verifyOtp = async (req, res, next) => { try { ok(res, await authService.verifyOtp(req.body)); } catch (e) { next(e); } };
export const setPassword = async (req, res, next) => { try { ok(res, await authService.setPassword(req.body), 201); } catch (e) { next(e); } };
export const forgotPassword = async (req, res, next) => { try { ok(res, await authService.forgotPassword(req.body)); } catch (e) { next(e); } };
export const resetPassword = async (req, res, next) => { try { ok(res, await authService.resetPassword(req.body)); } catch (e) { next(e); } };
export const login = async (req, res, next) => { try { ok(res, await authService.login(req.body)); } catch (e) { next(e); } };
export const profile = async (req, res, next) => { try { ok(res, { user: await authService.profile(req.user.userId) }); } catch (e) { next(e); } };
export const updateProfile = async (req, res, next) => { try { ok(res, { user: await authService.updateProfile(req.user.userId, req.body) }); } catch (e) { next(e); } };
export const updateSettings = async (req, res, next) => { try { ok(res, { user: await authService.updateSettings(req.user.userId, req.body) }); } catch (e) { next(e); } };
export const logout = async (_req, res) => ok(res, { message: "Logged out." });
// Declared in endpoints; harmless if called. Re-issues a token for the bearer.
export const refresh = async (req, res, next) => {
  try { const user = await authService.profile(req.user.userId); const { signToken } = await import("../utils/jwt.js"); ok(res, { user, token: signToken(user) }); }
  catch (e) { next(e); }
};
