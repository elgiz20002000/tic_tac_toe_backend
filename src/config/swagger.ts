import type { Express } from "express";
import swaggerUi from "swagger-ui-express";

import { openApiSpec } from "./openApiSpec.ts";

export const SWAGGER_UI_PATH = "/api-docs";

/**
 * Serves Swagger UI and a raw OpenAPI JSON at `{path}.json`.
 *
 * @param app - Express application instance.
 */
export function setupSwagger(app: Express): void {
  app.get(`${SWAGGER_UI_PATH}.json`, (_req, res) => {
    res.json(openApiSpec);
  });

  app.use(SWAGGER_UI_PATH, swaggerUi.serve, swaggerUi.setup(openApiSpec));
}
