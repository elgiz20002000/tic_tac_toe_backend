import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import process from "process";

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID || "",
      clientSecret: process.env.FACEBOOK_APP_SECRET || "",
      callbackURL: process.env.FACEBOOK_CALLBACK_URL || "",
      profileFields: ["id", "displayName", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      const userProfile = {
        id: profile.id,
        name: profile.displayName || null,
        email: profile.emails?.[0].value || null,
      };
      done(null, userProfile);
    },
  ),
);
