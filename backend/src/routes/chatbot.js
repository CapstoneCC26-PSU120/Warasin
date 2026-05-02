import express from "express";
import { authMiddleware } from "../middlewares/authMidleware.js";
import { startChat, saveAnswer, getHistory } from "../controllers/chatbotController.js";
import router from "./auth.js";

router.post("/start", authMiddleware, startChat);
router.post("/answer", authMiddleware, saveAnswer);
router.get("/history", authMiddleware, getHistory);

export default router;
