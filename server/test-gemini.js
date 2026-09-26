const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function testGemini() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: "Say hello to my AI Doctor Appointment project in one sentence.",
    });

    console.log("Gemini connected successfully ✅");
    console.log(response.text);
  } catch (error) {
    console.error("Gemini connection failed ❌");
    console.error(error.message);
  }
}

testGemini();