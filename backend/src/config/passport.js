import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "./db.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google OAuth profile received:", {
          id: profile.id,
          displayName: profile.displayName,
          emails: profile.emails,
        });

        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (!email) {
          throw new Error("No email found in Google OAuth profile");
        }

        const name = profile.displayName || "Google User";

        console.log("Checking if user exists for email:", email);
        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          console.log("User not found in DB. Creating new user record...");
          user = await prisma.user.create({
            data: {
              name,
              email,
              password: "google-login",
            },
          });
          console.log("New user created in DB successfully:", user.id);
        } else {
          console.log("Existing user found in DB:", user.id);
        }

        done(null, user);
      } catch (error) {
        console.error("Error in Google OAuth Strategy callback:", error);
        done(error, null);
      }
    },
  ),
);

export default passport;
