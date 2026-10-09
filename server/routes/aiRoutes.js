const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Retry Gemini request when service is temporarily unavailable
async function generateWithRetry(prompt, maxRetries = 3) {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
      });

      return response;
    } catch (error) {
      lastError = error;

      const status = error?.status;

      // Retry only temporary service/rate-limit errors
      if (status !== 503 && status !== 429) {
        throw error;
      }

      console.log(
        `Gemini temporarily unavailable. Retry ${
          attempt + 1
        }/${maxRetries}...`
      );

      // Exponential backoff:
      // 2 seconds → 4 seconds → 8 seconds
      const delay = 2000 * Math.pow(2, attempt);

      await new Promise((resolve) =>
        setTimeout(resolve, delay)
      );
    }
  }

  throw lastError;
}

router.post("/health-assistant", async (req, res) => {
  try {
    const { concern } = req.body;

    if (!concern || !concern.trim()) {
      return res.status(400).json({
        message: "Please describe your health concern.",
      });
    }

    const prompt = `
You are an AI healthcare appointment assistant.

User's health concern:
"${concern}"

Give a SHORT and SIMPLE response.

Use this format:

Doctor:
- Recommend the most appropriate doctor/specialist.

What to do:
- Give 2-3 simple general care suggestions.
- Do not prescribe medicines or dosages.

See a doctor urgently if:
- Mention only important warning signs if relevant.

Rules:
- Do not diagnose.
- Do not give long explanations.
- Do not repeat the user's concern.
- Keep the entire response under 80 words.
- Use simple language.
`;

    console.log("Health assistant request received. Concern:", concern);

    const response = await generateWithRetry(prompt);

    console.log("Gemini raw response.text:", JSON.stringify(response.text));
    console.log(
      "Gemini response.text length:",
      response.text ? response.text.length : "undefined/null"
    );

    res.json({
      success: true,
      result: response.text,
    });
  } catch (error) {
    console.error(
      "AI Health Assistant Error:",
      error
    );

    res.status(500).json({
      message:
        "AI assistant is temporarily unavailable. Please try again.",
    });
  }
});

module.exports = router;