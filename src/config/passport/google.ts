import type { Express } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = {
          id: profile.id,
          name: profile.displayName || "",
          email: profile.emails?.[0]?.value || "",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        done(null, user as Express.User);
      } catch (error) {
        done(error);
      }
    },
  ),
);
