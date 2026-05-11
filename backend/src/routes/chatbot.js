import express from "express";
import { authMiddleware } from "../middlewares/authMidleware.js";
import { submitAnswer, getHistory, deleteHistory } from "../controllers/chatbotController.js";
import router from "./auth.js";

router.post("/answer", authMiddleware, submitAnswer);
router.get("/history", authMiddleware, getHistory);
router.delete("/history/:id", authMiddleware, deleteHistory);

export default router;
