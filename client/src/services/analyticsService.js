import api from "../core/api/client.js";
import { API_ENDPOINTS } from "../config/api-endpoints.js";

export const getAnalyticsOverview = async () => {
  const res = await api.get(API_ENDPOINTS.ANALYTICS.OVERVIEW);
  return res.data;
};

export const getProductivityMetrics = async () => {
  const res = await api.get(API_ENDPOINTS.ANALYTICS.PRODUCTIVITY);
  return res.data;
};

export const getTeamPerformance = async () => {
  const res = await api.get(API_ENDPOINTS.ANALYTICS.TEAM_PERFORMANCE);
  return res.data;
};

export const getMeetingInsights = async () => {
  const res = await api.get(API_ENDPOINTS.ANALYTICS.MEETING_INSIGHTS);
  return res.data;
};

export const getKnowledgeMetrics = async () => {
  const res = await api.get(API_ENDPOINTS.ANALYTICS.KNOWLEDGE_METRICS);
  return res.data;
};
