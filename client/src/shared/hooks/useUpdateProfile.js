import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../../services/userService.js";
import useAuthStore from "../../core/store/authStore.js";

export default function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      updateUser(data?.user ?? data);
    },
  });
}
