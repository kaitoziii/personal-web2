// File: api/gemini-chat.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Ambil API Key dari Environment Variables (pastikan kamu set di Vercel)
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables.');
  throw new Error('Server configuration error: Gemini API Key is missing.');
}

const genAI = new GoogleGenerativeAI(API_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid "message" in request body.' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ reply: text });

  } catch (error) {
    console.error('Error from Gemini API:', error);
    return res.status(500).json({
      message: 'Failed to get response from Gemini API.',
      error: error.message
    });
  }
  console.log("ENV VAR:", process.env.GEMINI_API_KEY); // 👉 TEST LOG

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('❌ GEMINI_API_KEY is NOT SET');
  throw new Error('Gemini API Key is not set.');
}

};
