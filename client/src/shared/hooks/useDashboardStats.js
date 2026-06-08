import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../../services/dashboardService.js";

export default function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
    staleTime: 1000 * 60 * 2,
  });
}
