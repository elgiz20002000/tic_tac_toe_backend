import type { NextFunction, Request, Response } from "express";

import { httpRequestDurationSeconds, httpRequestsTotal } from "../config/prometheusMetrics.ts";
import { METRICS_PATH } from "../constants/metricsConstants.ts";

/**
 * Returns a stable route label for Prometheus (avoids high-cardinality paths on 404s).
 */
function getRouteLabel(req: Request, statusCode: number): string {
  if (req.route?.path !== undefined) {
    const base = req.baseUrl ?? "";
    return `${base}${req.route.path}`;
  }
  if (statusCode === 404) {
    return "not_found";
  }
  return "unmatched";
}

/**
 * Records HTTP request duration and count for Prometheus. Skips {@link METRICS_PATH}.
 */
export function prometheusHttpMetrics(req: Request, res: Response, next: NextFunction): void {
  if (req.path === METRICS_PATH) {
    next();
    return;
  }

  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const durationSec = Number(process.hrtime.bigint() - start) / 1e9;
    const route = getRouteLabel(req, res.statusCode);
    const labels = {
      method: req.method,
      route,
      status_code: String(res.statusCode),
    };
    httpRequestDurationSeconds.observe(labels, durationSec);
    httpRequestsTotal.inc(labels);
  });

  next();
}
