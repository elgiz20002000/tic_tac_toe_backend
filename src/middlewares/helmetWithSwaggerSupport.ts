import type { NextFunction, Request, Response } from "express";
import helmet from "helmet";

import { SWAGGER_UI_PATH } from "../config/swagger.ts";

const defaultHelmet = helmet();

/** Relaxed script-src so Swagger UI's inline bootstrap runs; other directives stay at Helmet defaults. */
const swaggerHelmet = helmet({
  contentSecurityPolicy: {
    directives: {
      scriptSrc: ["'self'", "'unsafe-inline'"],
    },
  },
});

function isSwaggerUiDocumentPath(path: string): boolean {
  return path === SWAGGER_UI_PATH || path.startsWith(`${SWAGGER_UI_PATH}/`);
}

/**
 * Applies Helmet globally; uses a Swagger-compatible CSP only for Swagger UI HTML/asset routes.
 * Leaves `/api-docs.json` on the default CSP (JSON only).
 *
 * @param req - Express request.
 * @param res - Express response.
 * @param next - Next middleware.
 */
export function helmetWithSwaggerSupport(req: Request, res: Response, next: NextFunction): void {
  if (isSwaggerUiDocumentPath(req.path)) {
    swaggerHelmet(req, res, next);
    return;
  }
  defaultHelmet(req, res, next);
}
