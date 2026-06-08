import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../../services/taskService.js";

export default function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });
}
