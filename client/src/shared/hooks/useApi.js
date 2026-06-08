import { useQuery } from "@tanstack/react-query";
import api from "../../core/api/client.js";

export default function useApi(queryKey, endpoint, options = {}) {
  return useQuery({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: async () => {
      const res = await api.get(endpoint);
      return res.data;
    },
    ...options,
  });
}
