// Configs
import "./config/env.ts";
import "./config/passport/google.ts";
import "./config/passport/facebook.ts";

import cors from "cors";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import helmet from "helmet";
import passport from "passport";

import { limiter } from "./config/rateLimit/index.ts";
// Import enums
import { EResponseError, EStatusMessages } from "./enums.ts";
import type { IResponseError } from "./interfaces.ts";
// Import middlewares
import { isAuth } from "./middlewares/isAuth.ts";
import AuthRouter from "./routes/auth/index.ts";
// Import route handlers and middleware
import CommonInfoRouter from "./routes/commonInfo/index.ts";
import FriendshipRouter from "./routes/friendship/index.ts";
import StatusRouter from "./routes/status/index.ts";

const app = express();
const PORT = process.env.PORT || 3000;
const allowedMethods = ["GET", "POST", "PUT", "DELETE"];

// Initialize middleware
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(limiter);
app.use(passport.initialize());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: allowedMethods,
    credentials: true,
  }),
);
app.use(helmet());

// Route handlers
app.use("/auth", AuthRouter);
app.use("/commonInfo", isAuth, CommonInfoRouter);
app.use("/status", isAuth, StatusRouter);
app.use("/friendship", isAuth, FriendshipRouter);

app.use((_, res) => {
  res.status(404).send(EResponseError.NotFoundError);
});

// Global error handler
app.use((err: IResponseError, req: Request, res: Response, _: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || EStatusMessages.InternalServerError,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Press Ctrl+C to stop the server`);
});
