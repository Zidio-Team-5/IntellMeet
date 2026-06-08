import { useQuery } from "@tanstack/react-query";
import { getDashboardInsights } from "../../services/dashboardService.js";

export default function useDashboardInsights() {
  return useQuery({
    queryKey: ["dashboard-insights"],
    queryFn: getDashboardInsights,
  });
}
