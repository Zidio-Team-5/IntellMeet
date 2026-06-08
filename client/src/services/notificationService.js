import api from "../core/api/client.js";
import { API_ENDPOINTS } from "../config/api-endpoints.js";

export const getNotifications = async () => {
  const res = await api.get(API_ENDPOINTS.NOTIFICATIONS.LIST);
  return res.data;
};

export const markNotificationRead = async (id) => {
  const res = await api.patch(API_ENDPOINTS.NOTIFICATIONS.READ(id));
  return res.data;
};

export const markAllNotificationsRead = async () => {
  const res = await api.patch(API_ENDPOINTS.NOTIFICATIONS.READ_ALL);
  return res.data;
};

export const deleteNotification = async (id) => {
  const res = await api.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(id));
  return res.data;
};
