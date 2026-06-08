import { useEffect } from "react";
import useAuthStore from "../../core/store/authStore.js";
import { getProfile } from "../../services/authService.js";

export default function useSessionBootstrap() {
  const { token, updateUser, logout } = useAuthStore();

  useEffect(() => {
    if (!token) return;

    const bootstrap = async () => {
      try {
        const profile = await getProfile();
        updateUser(profile?.user ?? profile);
      } catch {
        logout();
      }
    };

    bootstrap();
  }, [token, updateUser, logout]);
}
