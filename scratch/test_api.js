require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // There isn't a direct listModels in the simple genAI object usually, 
    // but we can try to hit the endpoint or use the older approach.
    // Actually, let's just try to call a simple generateContent with 'gemini-1.5-flash' 
    // but maybe try 'gemini-1.5-flash-8b' or 'gemini-pro' as fallback.
    console.log("Checking API Key...");
    if (!process.env.GEMINI_API_KEY) {
        console.error("API Key is missing!");
        return;
    }
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("test");
    console.log("Success with gemini-1.5-flash!");
  } catch (error) {
    console.error("Error with gemini-1.5-flash:", error.message);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("test");
        console.log("Success with gemini-pro!");
    } catch (err2) {
        console.error("Error with gemini-pro:", err2.message);
    }
  }
}

listModels();
