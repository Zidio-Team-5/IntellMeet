import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../../services/taskService.js";

export default function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
