import rateLimit from "express-rate-limit";

import { METRICS_PATH } from "../../constants/metricsConstants.ts";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skip: (req) => req.path === METRICS_PATH,
});
