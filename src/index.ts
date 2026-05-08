// Configs
import "./config/env.ts";
import "./config/passport/google.ts";
import "./config/passport/facebook.ts";

import { createServer } from "node:http";

import cors from "cors";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import passport from "passport";
import { register } from "prom-client";
import { setupPrometheusMetrics } from "./config/prometheusMetrics.ts";
import { limiter } from "./config/rateLimit/index.ts";
import { setupSwagger } from "./config/swagger.ts";
import { METRICS_PATH } from "./constants/metricsConstants.ts";
import { EResponseError, EStatusMessages } from "./enums.ts";
import type { IResponseError } from "./interfaces.ts";
import { helmetWithSwaggerSupport } from "./middlewares/helmetWithSwaggerSupport.ts";
import { isAuth } from "./middlewares/isAuth.ts";
import { prometheusHttpMetrics } from "./middlewares/prometheusHttpMetrics.ts";
import AuthRouter from "./routes/auth/index.ts";
import CommonInfoRouter from "./routes/commonInfo/index.ts";
import FriendshipRouter from "./routes/friendship/index.ts";
import StatusRouter from "./routes/status/index.ts";
import { initSocket } from "./socket/index.ts";

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

setupPrometheusMetrics();
const allowedMethods = ["GET", "POST", "PUT", "DELETE"];
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";

// Initialize middleware
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(limiter);
app.use(passport.initialize());
app.use(
  cors({
    origin: corsOrigin,
    methods: allowedMethods,
    credentials: true,
  }),
);
app.use(helmetWithSwaggerSupport);

app.use(prometheusHttpMetrics);

setupSwagger(app);

app.get(METRICS_PATH, async (_req, res) => {
  res.setHeader("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// Route handlers
app.use("/auth", AuthRouter);
app.use("/commonInfo", isAuth, CommonInfoRouter);
app.use("/status", isAuth, StatusRouter);
app.use("/friendship", isAuth, FriendshipRouter);

app.use((_, res) => {
  res.status(404).send(EResponseError.NotFoundError);
});

// Global error handler
app.use((err: IResponseError, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || EStatusMessages.InternalServerError,
  });
});

initSocket(httpServer, corsOrigin);

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API docs (Swagger UI): http://localhost:${PORT}/api-docs`);
  console.log(`WebSocket (Socket.IO) enabled`);
  console.log(`Press Ctrl+C to stop the server`);
});
