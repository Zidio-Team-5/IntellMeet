import api from "../core/api/client.js";
import { API_ENDPOINTS } from "../config/api-endpoints.js";
import { apiUrl } from "../shared/utils/environment.js";
import useAuthStore from "../core/store/authStore.js";

// Full-page redirect to Google's consent screen (not an XHR call) - the auth
// token is passed as a query param since a plain browser navigation can't
// carry an Authorization header.
export const connectGoogleDrive = () => {
  const token = useAuthStore.getState().token;
  window.location.href = `${apiUrl}${API_ENDPOINTS.DRIVE.CONNECT}?token=${encodeURIComponent(token)}`;
};

export const getDriveStatus = async () => {
  const res = await api.get(API_ENDPOINTS.DRIVE.STATUS);
  return res.data;
};

export const disconnectGoogleDrive = async () => {
  const res = await api.post(API_ENDPOINTS.DRIVE.DISCONNECT);
  return res.data;
};
