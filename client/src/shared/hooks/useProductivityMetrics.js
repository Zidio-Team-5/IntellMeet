import { useQuery } from "@tanstack/react-query";
import { getProductivityMetrics } from "../../services/analyticsService.js";

export default function useProductivityMetrics() {
  return useQuery({
    queryKey: ["productivity-metrics"],
    queryFn: getProductivityMetrics,
  });
}
