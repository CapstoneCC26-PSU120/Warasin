import express from "express";
import { authMiddleware } from "../middlewares/authMidleware.js";
import { submitAnswer, getHistory, getHistoryById, deleteHistory } from "../controllers/chatbotController.js";
import router from "./auth.js";

router.post("/answer", authMiddleware, submitAnswer);
router.get("/history", authMiddleware, getHistory);
router.get("/history/:id", authMiddleware, getHistoryById)
router.delete("/history/:id", authMiddleware, deleteHistory);

export default router;
