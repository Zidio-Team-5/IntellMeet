import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../services/userService.js";

export default function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
}
