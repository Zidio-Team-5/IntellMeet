import { Navigate } from "react-router-dom";
import useAuthStore from "../core/store/authStore.js";
import { ROUTES } from "../config/routes.config.js";

export default function PublicRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  return children;
}
