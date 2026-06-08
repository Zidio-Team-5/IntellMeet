import api from "../core/api/client.js";
import { API_ENDPOINTS } from "../config/api-endpoints.js";

export const getDashboardStats = async () => {
  const res = await api.get(API_ENDPOINTS.DASHBOARD.STATS);
  return res.data;
};

export const getDashboardActivity = async () => {
  const res = await api.get(API_ENDPOINTS.DASHBOARD.ACTIVITY);
  return res.data;
};

export const getDashboardInsights = async () => {
  const res = await api.get(API_ENDPOINTS.DASHBOARD.INSIGHTS);
  return res.data;
};

export const getUpcomingMeetings = async () => {
  const res = await api.get(API_ENDPOINTS.DASHBOARD.UPCOMING);
  return res.data;
};
