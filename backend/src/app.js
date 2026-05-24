import express from "express";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.js";
import chatbotRoutes from "./routes/chatbot.js";
import faceRoutes from "./routes/faceRoutes.js";
import cors from "cors";
import { logMiddleware } from "./middlewares/logMiddleware.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:4000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(logMiddleware);
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("API is running!");
});

// toute auth
app.use("/api/auth", authRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/face", faceRoutes);

export default app;
