import api from "../core/api/client.js";
import { API_ENDPOINTS } from "../config/api-endpoints.js";

export const loginUser = async (payload) => {
  const res = await api.post(API_ENDPOINTS.AUTH.LOGIN, payload);
  return res.data;
};

// Step 1: kick off signup — sends an OTP to the given email. Returns
// { pendingEmail } — no token yet.
export const registerUser = async (payload) => {
  const res = await api.post(API_ENDPOINTS.AUTH.REGISTER, payload);
  return res.data;
};

export const resendOtp = async (email) => {
  const res = await api.post(API_ENDPOINTS.AUTH.RESEND_OTP, { email });
  return res.data;
};

// Step 2: confirm the emailed code.
export const verifyOtp = async (email, code) => {
  const res = await api.post(API_ENDPOINTS.AUTH.VERIFY_OTP, { email, code });
  return res.data;
};

// Step 3: set the real password — returns { user, token }.
export const setPassword = async (email, password) => {
  const res = await api.post(API_ENDPOINTS.AUTH.SET_PASSWORD, { email, password });
  return res.data;
};

export const getProfile = async () => {
  const res = await api.get(API_ENDPOINTS.AUTH.PROFILE);
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post(API_ENDPOINTS.AUTH.LOGOUT);
  return res.data;
};
