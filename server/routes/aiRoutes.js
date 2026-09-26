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

The user has described this health concern:

"${concern}"

Your job is NOT to diagnose the user.

Provide a concise, safe response in this exact structure:

Suggested Specialist:
- Give the most relevant doctor specialization.
- If uncertain, mention the uncertainty.

Why:
- Briefly explain why this specialization may be relevant.

General Guidance:
- Give 2-3 general, non-diagnostic suggestions.

Urgent Warning:
- Mention symptoms that should require urgent medical attention if relevant.
- If there is no obvious emergency from the description, say that clearly.

Important:
- Do not diagnose diseases.
- Do not prescribe medicines or dosages.
- Encourage consultation with a qualified healthcare professional.
- Keep the answer easy to understand.
`;

    const response = await generateWithRetry(prompt);

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