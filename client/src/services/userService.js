import api from "../core/api/client.js";
import { API_ENDPOINTS } from "../config/api-endpoints.js";

export const getProfile = async () => {
  const res = await api.get(API_ENDPOINTS.USERS.ME);
  return res.data;
};

export const updateProfile = async (payload) => {
  const res = await api.put(API_ENDPOINTS.USERS.UPDATE, payload);
  return res.data;
};

export const updateSettings = async (payload) => {
  const res = await api.put(API_ENDPOINTS.USERS.SETTINGS, payload);
  return res.data;
};
