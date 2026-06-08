import api from "../core/api/client.js";
import { API_ENDPOINTS } from "../config/api-endpoints.js";

export const globalSearch = async (query) => {
  const res = await api.post(API_ENDPOINTS.SEARCH.GLOBAL, { query });
  return res.data;
};

export const searchKnowledgeBase = async (query) => {
  const res = await api.post(API_ENDPOINTS.SEARCH.KNOWLEDGE, { query });
  return res.data;
};
