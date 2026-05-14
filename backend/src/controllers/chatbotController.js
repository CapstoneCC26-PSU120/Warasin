import prisma from "../config/db.js";

export const submitAnswer = async (req, res) => {
  try {
    const answers = req.body;

    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({
        message: "Answers are required",
      });
    }

    // DUMMY AI RESPONSE
    const aiResult = {
      score: 72,
      category: "Medium Stress",
      advice: "Try improving sleep quality and reduce stress level.",
    };

    const history = await prisma.chatHistory.create({
      data: {
        userId: req.user.userId,
        answers,
        score: aiResult.score,
        category: aiResult.category,
        advice: aiResult.advice,
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
    console.error(error);

    res.status(500).json({
      message: "Failed to process chatbot",
      error: error.message,
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
