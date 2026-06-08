import api from "../core/api/client.js";
import { API_ENDPOINTS } from "../config/api-endpoints.js";

export const getMeetings = async () => {
  const res = await api.get(API_ENDPOINTS.MEETINGS.LIST);
  return res.data;
};

export const getMeetingHistory = async () => {
  const res = await api.get(API_ENDPOINTS.MEETINGS.HISTORY);
  return res.data;
};

export const getMeetingDetails = async (id) => {
  const res = await api.get(API_ENDPOINTS.MEETINGS.DETAILS(id));
  return res.data;
};

export const createMeeting = async (payload) => {
  const res = await api.post(API_ENDPOINTS.MEETINGS.CREATE, payload);
  return res.data;
};

export const joinMeeting = async (id) => {
  const res = await api.post(API_ENDPOINTS.MEETINGS.JOIN(id));
  return res.data;
};

export const leaveMeeting = async (id) => {
  const res = await api.post(API_ENDPOINTS.MEETINGS.LEAVE(id));
  return res.data;
};

export const endMeeting = async (id) => {
  const res = await api.post(API_ENDPOINTS.MEETINGS.END(id));
  return res.data;
};

export const getMeetingTranscript = async (id) => {
  const res = await api.get(API_ENDPOINTS.MEETINGS.TRANSCRIPT(id));
  return res.data;
};
