const { GoogleGenerativeAI } = require('@google/generative-ai');

// Ambil API Key dari Environment Variables (SANGAT PENTING!)
// Anda akan mengatur GEMINI_API_KEY di pengaturan Vercel
const API_KEY = process.env.GEMINI_API_KEY;

// Pastikan API Key ada
if (!API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables.');
  // Ini untuk penanganan error yang lebih baik di produksi,
  // tapi untuk contoh ini, kita biarkan saja.
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Vercel Functions menggunakan format default export
// Ini adalah fungsi utama yang akan dipanggil Vercel
module.exports = async (request, response) => {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { message } = request.body;

    if (!message) {
      return response.status(400).json({ message: 'Missing "message" in request body.' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(message);
    const apiResponse = await result.response; // Ganti nama variabel agar tidak bentrok
    const text = apiResponse.text();

    return response.status(200).json({ reply: text });
  } catch (error) {
    console.error('Error in Gemini API call:', error);
    return response.status(500).json({ message: 'Failed to get response from AI.', error: error.message });
  }
};