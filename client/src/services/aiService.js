import api from "../core/api/client.js";
import { API_ENDPOINTS } from "../config/api-endpoints.js";

export const generateSummary = async (transcript) => {
  const res = await api.post(API_ENDPOINTS.AI.SUMMARY, { transcript });
  return res.data;
};

export const extractActionItems = async (transcript) => {
  const res = await api.post(API_ENDPOINTS.AI.ACTION_ITEMS, { transcript });
  return res.data;
};

export const askAI = async (message, context) => {
  const res = await api.post(API_ENDPOINTS.AI.CHAT, { message, context });
  return res.data;
};

export const searchKnowledge = async (query) => {
  const res = await api.post(API_ENDPOINTS.AI.SEARCH, { query });
  return res.data;
};

export const getAITemplates = async () => {
  const res = await api.get(API_ENDPOINTS.AI.TEMPLATES);
  return res.data;
};

export const getAIHistory = async () => {
  const res = await api.get(API_ENDPOINTS.AI.HISTORY);
  return res.data;
};
