// File: api/gemini-chat.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Ambil API Key dari Environment Variables (SANGAT PENTING!)
// Anda akan mengatur GEMINI_API_KEY di pengaturan Vercel
const API_KEY = process.env.GEMINI_API_KEY;

// Pastikan API Key ada
if (!API_KEY) {
  // Jika API_KEY tidak ditemukan, log error dan kirimkan respons error
  console.error('GEMINI_API_KEY is not set in environment variables.');
  // Penting: Di lingkungan produksi, Anda mungkin ingin menanggapi ini dengan lebih aman
  // Misalnya, menghentikan eksekusi atau memberikan pesan error generik.
  // Untuk tujuan debugging, kita bisa melempar error agar terlihat di log Vercel.
  throw new Error('Server configuration error: Gemini API Key is missing.');
}

// Inisialisasi GoogleGenerativeAI dengan API Key
const genAI = new GoogleGenerativeAI(API_KEY);

// Fungsi utama Vercel Function yang akan dieksekusi
module.exports = async (request, response) => {
  // Pastikan hanya menerima permintaan POST
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Parsing pesan dari body permintaan
    const { message } = request.body;

    // Validasi apakah ada pesan yang dikirim
    if (!message) {
      return response.status(400).json({ message: 'Missing "message" in request body.' });
    }

    // Dapatkan model Generative AI
    // Menggunakan "gemini-pro" untuk model teks
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Panggil Gemini API untuk menghasilkan konten
    const result = await model.generateContent(message);
    const apiResponse = await result.response; // Respons dari API
    const text = apiResponse.text(); // Ambil teks dari respons

    // Kirim respons balik ke frontend
    return response.status(200).json({ reply: text });

  } catch (error) {
    // Tangani error yang mungkin terjadi selama komunikasi dengan Gemini API
    console.error('Error in Gemini API call or function execution:', error);
    return response.status(500).json({ message: 'Failed to get response from AI.', error: error.message });
  }
};
