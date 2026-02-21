import { Router } from "express";

import * as statusController from "../../controllers/status.controller.ts";
import { validateBody } from "../../middlewares/validateBody.ts";
import * as statusValidators from "../../validators/status.validator.ts";

const router = Router();

router.post(
  "/change-status",
  validateBody(statusValidators.changeStatusSchema),
  statusController.changeStatus,
);

export default router;
