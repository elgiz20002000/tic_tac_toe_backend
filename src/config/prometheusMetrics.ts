import { Counter, collectDefaultMetrics, Histogram, register } from "prom-client";

import {
  METRIC_HTTP_REQUEST_DURATION_SECONDS,
  METRIC_HTTP_REQUESTS_TOTAL,
} from "../constants/metricsConstants.ts";

let hasRegisteredDefaultMetrics = false;

/**
 * Request duration histogram (seconds). Labels: method, route, status_code.
 */
export const httpRequestDurationSeconds = new Histogram({
  name: METRIC_HTTP_REQUEST_DURATION_SECONDS,
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register],
});

/**
 * Total HTTP requests counter. Labels: method, route, status_code.
 */
export const httpRequestsTotal = new Counter({
  name: METRIC_HTTP_REQUESTS_TOTAL,
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

/**
 * Registers standard Node.js and OS Prometheus metrics once on the default registry.
 * Subsequent calls do nothing so duplicate collectors are not attached.
 */
export function setupPrometheusMetrics(): void {
  if (hasRegisteredDefaultMetrics) {
    return;
  }
  collectDefaultMetrics({ register });
  hasRegisteredDefaultMetrics = true;
}
