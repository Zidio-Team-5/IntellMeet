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

export const updateMeeting = async (id, payload) => {
  const res = await api.patch(API_ENDPOINTS.MEETINGS.UPDATE(id), payload);
  return res.data;
};

export const deleteMeeting = async (id) => {
  const res = await api.delete(API_ENDPOINTS.MEETINGS.DELETE(id));
  return res.data;
};

export const inviteToMeeting = async (id, invites) => {
  const res = await api.post(API_ENDPOINTS.MEETINGS.INVITE(id), { invites });
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

export const generateMeetingNotes = async (id) => {
  const res = await api.post(API_ENDPOINTS.MEETINGS.SUMMARY(id));
  return res.data;
};

export const uploadMeetingRecording = async (id, blob) => {
  const form = new FormData();
  form.append("recording", blob, "recording.webm");
  const res = await api.post(API_ENDPOINTS.MEETINGS.RECORDING(id), form, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 120000, // recordings can take a while to upload
  });
  return res.data;
};
