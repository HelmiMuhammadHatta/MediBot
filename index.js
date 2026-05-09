require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// AI Configuration
const generationConfig = {
  temperature: 0.8,
  topP: 0.95,
  maxOutputTokens: 1024,
};

const systemInstruction = `Anda adalah MediBot, asisten kesehatan pribadi yang ramah dan suportif. 
Gunakan bahasa Indonesia yang menenangkan, empatik, dan mudah dimengerti. 
Berikan penjelasan mengenai gejala kesehatan, nutrisi, kesehatan mental, obat-obatan umum, dan pola hidup sehat. 
Penting: JANGAN memberikan diagnosis medis pasti atau resep obat keras secara mandiri. 
Selalu ingatkan pengguna untuk berkonsultasi dengan dokter profesional atau tenaga medis ahli jika mengalami kondisi yang serius atau membutuhkan penanganan langsung.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, subject } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'API Key Gemini belum dikonfigurasi di server.' });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: {
        parts: [{ text: systemInstruction + (subject ? ` Fokus saat ini adalah mata pelajaran: ${subject}.` : "") }]
      }
    });

    const chat = model.startChat({
      history: history || [],
      generationConfig,
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error('Error with Gemini AI:', error);
    // Return more specific error if available
    const errorMessage = error.message || 'Terjadi kesalahan saat memproses permintaan Anda.';
    res.status(500).json({ error: errorMessage });
  }
});

app.listen(port, () => {
  console.log(`EduBot server running at http://localhost:${port}`);
});

module.exports = app;
