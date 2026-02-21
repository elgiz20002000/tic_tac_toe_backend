import { Router } from "express";
import passport from "passport";

import * as authController from "../../controllers/auth.controller.ts";

const router = Router();

router.get(
  "/facebook",
  passport.authenticate("facebook", { state: "myapp://auth/callback", scope: ["public_profile"] }),
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  authController.loginCallback,
);

// Google OAuth

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.loginCallback,
);

export default router;
