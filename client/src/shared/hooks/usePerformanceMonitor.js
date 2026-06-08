import { useEffect } from "react";
import { performanceTracker } from "../../core/monitoring/performanceTracker.js";

export default function usePerformanceMonitor(label) {
  useEffect(() => {
    performanceTracker.start(label);
    return () => {
      performanceTracker.end(label);
    };
  }, [label]);
}
