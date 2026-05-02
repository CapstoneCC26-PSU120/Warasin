import express from "express";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.js";
import chatbotRoutes from "./routes/chatbot.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("API is running!");
});

// toute auth
app.use("/api/auth", authRoutes);
app.use("/api/chatbot", chatbotRoutes);

export default app;
