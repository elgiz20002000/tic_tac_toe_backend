/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

import { EResponseError } from "../enums.ts";
import { createResponseError } from "../utils/createResponseError.ts";

export const validateBody =
  (schema: ZodSchema<unknown>) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      const error = createResponseError(err.errors, EResponseError.ValidationError, 400);
      next(error);
    }
  };
