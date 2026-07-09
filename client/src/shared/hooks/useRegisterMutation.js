import { useMutation } from "@tanstack/react-query";
import { registerUser, resendOtp, verifyOtp, setPassword } from "../../services/authService.js";
import useAuthStore from "../../core/store/authStore.js";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/routes.config.js";

// Step 1 — send OTP. Does NOT log the user in (no account is usable yet).
export default function useRegisterMutation() {
  return useMutation({ mutationFn: registerUser });
}

export function useResendOtpMutation() {
  return useMutation({ mutationFn: resendOtp });
}

// Step 2 — confirm the code.
export function useVerifyOtpMutation() {
  return useMutation({ mutationFn: ({ email, code }) => verifyOtp(email, code) });
}

// Step 3 — set password, then log in for real.
export function useSetPasswordMutation() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({ email, password }) => setPassword(email, password),
    onSuccess: (data) => {
      login(data.user, data.token);
      navigate(ROUTES.DASHBOARD);
    },
  });
}
