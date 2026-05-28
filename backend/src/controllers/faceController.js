import axios from "axios";
import FormData from "form-data";

export const analyzeFace = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const formData = new FormData();

    formData.append("file", req.file.buffer, req.file.originalname);

    const aiResponse = await axios.post(
      `${process.env.FASTAPI_URL}/predict/emotion/upload`,
      formData,
      {
        headers: formData.getHeaders(),
      },
    );

    res.status(200).json({
      message: "Face analysis completed successfully",
      data: aiResponse.data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to analyze face",
      error: error.response?.data || error.message,
    });
  }
};
