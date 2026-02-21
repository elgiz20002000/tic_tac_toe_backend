import { Router } from "express";

import * as friendshipController from "../../controllers/friendship.controller.ts";
import { validateBody } from "../../middlewares/validateBody.ts";
import * as friendshipValidators from "../../validators/friendship.validator.ts";

const router = Router();

router.post(
  "/send-friendship",
  validateBody(friendshipValidators.createFriendshipSchema),
  friendshipController.sendFriendshipRequest,
);

router.post(
  "/accept-friendship",
  validateBody(friendshipValidators.acceptFriendshipSchema),
  friendshipController.acceptFriendshipRequest,
);

router.post(
  "/reject-friendship",
  validateBody(friendshipValidators.rejectFriendshipSchema),
  friendshipController.rejectFriendshipRequest,
);

router.get("/get-all-friendship-requests", friendshipController.getAllUserFriendshipRequests);

router.get("/get-all-friends", friendshipController.getAllUserFriends);

export default router;
