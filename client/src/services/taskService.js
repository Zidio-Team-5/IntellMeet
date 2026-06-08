import api from "../core/api/client.js";
import { API_ENDPOINTS } from "../config/api-endpoints.js";

export const getTasks = async () => {
  const res = await api.get(API_ENDPOINTS.TASKS.LIST);
  return res.data;
};

export const getTask = async (id) => {
  const res = await api.get(API_ENDPOINTS.TASKS.DETAILS(id));
  return res.data;
};

export const createTask = async (payload) => {
  const res = await api.post(API_ENDPOINTS.TASKS.CREATE, payload);
  return res.data;
};

export const updateTask = async (id, payload) => {
  const res = await api.put(API_ENDPOINTS.TASKS.UPDATE(id), payload);
  return res.data;
};

export const deleteTask = async (id) => {
  const res = await api.delete(API_ENDPOINTS.TASKS.DELETE(id));
  return res.data;
};
