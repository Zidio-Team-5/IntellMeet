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

// --- Admin-only actions (backend enforces the role check too) ---

export const addTeamMember = async ({ name, email, role }) => {
  const res = await api.post(API_ENDPOINTS.TEAM.ADD_MEMBER, { name, email, role });
  return res.data;
};

export const promoteMember = async (id) => {
  const res = await api.post(API_ENDPOINTS.TEAM.PROMOTE(id));
  return res.data;
};

export const demoteMember = async (id) => {
  const res = await api.post(API_ENDPOINTS.TEAM.DEMOTE(id));
  return res.data;
};

export const removeMember = async (id) => {
  const res = await api.delete(API_ENDPOINTS.TEAM.REMOVE(id));
  return res.data;
};
