import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import queryClient from "../../lib/queryClient.js";
import { AuthProvider } from "../../context/AuthContext.jsx";
import { ThemeProvider } from "../../theme/ThemeProvider.jsx";
import ErrorBoundary from "../../shared/ui/ErrorBoundary.jsx";
import GlobalErrorFallback from "../../shared/ui/GlobalErrorFallback.jsx";
import RealtimeProvider from "./RealtimeProvider.jsx";
import Toaster from "../../shared/ui/Toaster.jsx";
import useSettingsEffects from "../../shared/hooks/useSettingsEffects.js";

function SettingsEffects() {
  useSettingsEffects();
  return null;
}

export default function AppProviders({ children }) {
  return (
    <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BrowserRouter>
            <AuthProvider>
              <SettingsEffects />
              <RealtimeProvider>{children}</RealtimeProvider>
              <Toaster />
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
