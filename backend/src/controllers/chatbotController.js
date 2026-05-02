import prisma from "../config/db.js";

export const startChat = async (req, res) => {
  try {
    await prisma.chatSession.updateMany({
      where: {
        userId: req.user.userId,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    await prisma.chatSession.create({
      data: {
        userId: req.user.userId,
        isActive: true,
      },
    });

    res.json({ message: "Session started successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to start session" });
  }
};

export const saveAnswer = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Answers must be an array" });
    }

    const session = await prisma.chatSession.findFirst({
      where: {
        userId: req.user.userId,
        isActive: true,
      },
    });

    if (!session) {
      return res.status(404).json({ message: "Active session not found" });
    }

    await prisma.chatSession.update({
      where: { id: session.id },
      data: { answers },
    });

    res.json({ message: "Answers saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to save answers" });
  }
};

export const getHistory = async (req, res) => {
  try {
    const sessions = await prisma.chatSession.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
};
