import logger from "./logger.js";

class PerformanceTracker {
  constructor() {
    this.marks = new Map();
  }

  start(label) {
    this.marks.set(label, performance.now());
  }

  end(label) {
    const start = this.marks.get(label);
    if (!start) return null;
    const duration = performance.now() - start;
    this.marks.delete(label);
    logger.debug(`[Perf] ${label}: ${duration.toFixed(2)}ms`);
    return duration;
  }

  measure(label, fn) {
    this.start(label);
    const result = fn();
    if (result instanceof Promise) {
      return result.finally(() => this.end(label));
    }
    this.end(label);
    return result;
  }
}

export const performanceTracker = new PerformanceTracker();
export default performanceTracker;
