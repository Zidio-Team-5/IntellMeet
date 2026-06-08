import { createContext, useContext } from "react";
import useAuthStore from "../core/store/authStore.js";
import useSessionBootstrap from "../shared/hooks/useSessionBootstrap.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  useSessionBootstrap();
  const auth = useAuthStore();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
