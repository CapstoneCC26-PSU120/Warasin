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
    });

    res.json(histories);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get history",
      error: error.message,
    });
  }
};
