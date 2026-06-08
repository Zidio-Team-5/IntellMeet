import api from "../core/api/client.js";
import { API_ENDPOINTS } from "../config/api-endpoints.js";

export const getTeamMembers = async () => {
  const res = await api.get(API_ENDPOINTS.TEAM.LIST);
  return res.data;
};

export const getTeamWorkload = async () => {
  const res = await api.get(API_ENDPOINTS.TEAM.WORKLOAD);
  return res.data;
};

export const getTeamPresence = async () => {
  const res = await api.get(API_ENDPOINTS.TEAM.PRESENCE);
  return res.data;
};

export const getCollaborationGraph = async () => {
  const res = await api.get(API_ENDPOINTS.TEAM.COLLABORATION);
  return res.data;
};
