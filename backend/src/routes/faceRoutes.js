import express from "express";
import { analyzeFace } from "../controllers/faceController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/analyze",
  authMiddleware,
  upload.single("image"),
  analyzeFace
);

export default router;