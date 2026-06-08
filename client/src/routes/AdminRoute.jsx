import { Navigate } from "react-router-dom";
import useAuthStore from "../core/store/authStore.js";
import { ROUTES } from "../config/routes.config.js";
import { isAdmin } from "../shared/utils/permissions.js";

export default function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  if (!isAdmin(user)) return <Navigate to={ROUTES.DASHBOARD} replace />;
  return children;
}
