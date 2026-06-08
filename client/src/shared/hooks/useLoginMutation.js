import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService.js";
import useAuthStore from "../../core/store/authStore.js";
import { ROUTES } from "../../config/routes.config.js";

export default function useLoginMutation() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(data.user, data.token);
      navigate(ROUTES.DASHBOARD);
    },
  });
}
