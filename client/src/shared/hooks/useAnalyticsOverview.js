import { useQuery } from "@tanstack/react-query";
import { getAnalyticsOverview } from "../../services/analyticsService.js";

export default function useAnalyticsOverview() {
  return useQuery({
    queryKey: ["analytics-overview"],
    queryFn: getAnalyticsOverview,
  });
}
