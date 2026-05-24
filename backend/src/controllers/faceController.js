export const analyzeFace = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    // DUMMY RESPONSE
    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        predicted_class: "Happy",
        confidence: 0.9452,
        predictions_probability: {
          Angry: 0.0012,
          Disgust: 0.0004,
          Fear: 0.0031,
          Happy: 0.9452,
          Sad: 0.0102,
          Surprise: 0.0315,
          Neutral: 0.0084,
        },
      },
    };

    res.status(200).json({
      message: "Face analysis completed successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to analyze face",
      error: error.message,
    });
  }
};