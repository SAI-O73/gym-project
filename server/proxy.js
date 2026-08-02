const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

if (!GEMINI_KEY) {
  console.warn('Warning: GEMINI_API_KEY is not set. Proxy will return an error for requests.');
}

app.post('/ask', async (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'Missing message' });
  if (!GEMINI_KEY) return res.status(500).json({ error: 'Server missing Gemini API key' });

  const prompt = `You are an elite AI fitness coach. Respond only to fitness, nutrition, workout, recovery, fat loss, muscle gain, protein, hydration, supplements, and general health-related questions. If the user asks something unrelated, reply exactly: \"I'm your AI Fitness Coach. Please ask only fitness, nutrition, workout or health related questions.\"\n\nUser: ${message}`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
    res.json({ text });
  } catch (err) {
    console.error('Proxy error', err?.response?.data || err.message || err);
    const status = err?.response?.status || 500;
    res.status(status).json({ error: err?.response?.data || err.message || 'AI service error' });
  }
});

app.listen(PORT, () => {
  console.log(`Gemini proxy running on http://localhost:${PORT}`);
});
