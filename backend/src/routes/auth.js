import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { register, login, getMe, logout, updateProfile } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.post("/logout", logout);
router.put("/profile", authMiddleware, updateProfile);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });

    const isProduction = process.env.NODE_ENV === "production" || process.env.GOOGLE_CALLBACK_URL?.includes("railway.app");

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 30 * 60 * 1000,
    });

    res.redirect(`${process.env.FRONTEND_URL}/measurement?token=${token}`);
  },
);

export default router;
