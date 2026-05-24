import prisma from "../config/db.js";
import axios from "axios";

export const submitAnswer = async (req, res) => {
  try {
    const answers = req.body;

    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({
        message: "Answers are required",
      });
    }

    const aiPayload = {
      Gender: answers.gender,
      Age: Number(answers.age),
      Occupation: answers.occupation,
      "Sleep Duration": Number(answers.sleep_duration),
      "Quality of Sleep": Number(answers.sleep_quality),
      "Physical Activity Level": Number(answers.physical_activity),
      "BMI Category": answers.bmi,
      "Heart Rate": Number(answers.heart_rate),
      "Daily Steps": Number(answers.daily_steps),
      "Sleep Disorder": answers.sleep_disorder || null,
      BP_Systolic: Number(answers.bp_systolic),
      BP_Diastolic: Number(answers.bp_diastolic),
    };

    console.log("aiPayload being sent:", JSON.stringify(aiPayload, null, 2));

    // const aiResponse = await axios.post("http://127.0.0.1:8000/predict", aiPayload);
    const aiResponse = await axios.post("http://localhost:8000/predict/stress", aiPayload);

    const aiResult = aiResponse.data;

    // Ambil probabilitas sesuai class_index dan konversi ke persen
    // const probMap = { 0: "Rendah", 1: "Sedang", 2: "Tinggi" };
    // const probKey = probMap[aiResult.class_index];
    // const score = Math.round(aiResult.probabilities[probKey] * 100);
    const score = Math.round(aiResult.data.stress_score);

    const history = await prisma.chatHistory.create({
      data: {
        userId: req.user.userId,
        answers,
        score,
        category: aiResult.data.label,
        advice: aiResult.data.message,
      },
    });

    res.status(201).json({
      message: "Stress analysis completed",
      result: {
        score: history.score,
        category: history.category,
        advice: history.advice,
      },
    });
  } catch (error) {
    if (error.response) {
      console.error("AI model error:", error.response.status, JSON.stringify(error.response.data));
    } else {
      console.error("submitAnswer error:", error.message);
    }

    res.status(500).json({
      message: "Failed to process chatbot",
      error: error.response?.data || error.message,
    });
  }
};

export const getHistory = async (req, res) => {
  try {
    const histories = await prisma.chatHistory.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        answers: true,
        score: true,
        category: true,
        advice: true,
        createdAt: true,
      },
    });

    res.json({
      userId: req.user.userId,
      data: histories,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get history",
      error: error.message,
    });
  }
};

export const getHistoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const history = await prisma.chatHistory.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
      select: {
        id: true,
        answers: true,
        score: true,
        category: true,
        advice: true,
        createdAt: true,
      },
    });

    if (!history) {
      return res.status(404).json({
        message: "History not found",
      });
    }

    res.json({
      userId: req.user.userId,
      data: [history],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get history detail",
    });
  }
};

export const deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const history = await prisma.chatHistory.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!history) {
      return res.status(404).json({
        message: "History not found",
      });
    }

    await prisma.chatHistory.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "History deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete history",
      error: error.message,
    });
  }
};
