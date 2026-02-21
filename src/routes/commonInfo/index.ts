import { Router } from "express";

import * as commonInfoController from "../../controllers/commonInfo.controller.ts";
import { validateQuery } from "../../middlewares/validateQuery.ts";
import * as commonInfoValidators from "../../validators/commonInfo.validator.ts";

const router = Router();

router.get("/main-page", commonInfoController.getMainPage);

router.get(
  "/game-history",
  validateQuery(commonInfoValidators.getGameHistorySchema),
  commonInfoController.getGameHistory,
);

router.get(
  "/scoreboard",
  validateQuery(commonInfoValidators.getScoreboardSchema),
  commonInfoController.getScoreboard,
);

export default router;
