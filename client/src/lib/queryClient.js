import { QueryClient } from "@tanstack/react-query";
import appConfig from "../config/app.config.js";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: appConfig.queryRetries,
      staleTime: appConfig.queryStaleTime,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

export default queryClient;
