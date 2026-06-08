import api from "../core/api/client.js";
import { API_ENDPOINTS } from "../config/api-endpoints.js";

export const loginUser = async (payload) => {
  const res = await api.post(API_ENDPOINTS.AUTH.LOGIN, payload);
  return res.data;
};

export const registerUser = async (payload) => {
  const res = await api.post(API_ENDPOINTS.AUTH.REGISTER, payload);
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
