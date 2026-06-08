import { Navigate } from "react-router-dom";
import useAuthStore from "../core/store/authStore.js";
import { ROUTES } from "../config/routes.config.js";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return children;
}
