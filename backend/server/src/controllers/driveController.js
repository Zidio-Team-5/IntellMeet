import * as driveService from "../services/driveService.js";
import { ok, fail } from "../utils/respond.js";
import { verifyToken } from "../utils/jwt.js";

// Kick off Google's consent screen. The frontend navigates the browser here
// directly (not an XHR call) since it's a full-page redirect to Google, so
// there's no Authorization header available — the caller's own JWT is passed
// as a query param instead and verified manually here.
export const connect = (req, res) => {
  try {
    const token = req.query.token;
    if (!token) return fail(res, "Missing auth token.", 401);
    verifyToken(token); // just validate it's a real, current session before sending them to Google
    const url = driveService.getAuthUrl(token); // echoed back verbatim by Google as `state`
    res.redirect(url);
  } catch (e) {
    fail(res, e.message || "Couldn't start Google Drive connection.", e.status || 500);
  }
};

export const callback = async (req, res) => {
  const frontend = process.env.CLIENT_URL || "/";
  try {
    const { code, state } = req.query;
    const decoded = verifyToken(state);
    await driveService.handleCallback(code, decoded.userId);
    res.redirect(`${frontend}/settings?drive=connected`);
  } catch (e) {
    res.redirect(`${frontend}/settings?drive=error`);
  }
};

export const status = async (req, res, next) => { try { ok(res, await driveService.status(req.user.userId)); } catch (e) { next(e); } };
export const disconnect = async (req, res, next) => { try { ok(res, await driveService.disconnect(req.user.userId)); } catch (e) { next(e); } };
