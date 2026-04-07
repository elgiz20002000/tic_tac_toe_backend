import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodSchema } from "zod";

import { EResponseError } from "../enums.ts";
import { createResponseError } from "../utils/createResponseError.ts";

export const validateBody =
  (schema: ZodSchema<unknown>) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        const error = createResponseError(err.message, EResponseError.ValidationError, 400);
        next(error);
        return;
      }
      next(err);
    }
  };
