const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const CONTACT_TO_EMAIL = 'dsaimtm@gmail.com';
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'FIT73 Contact <onboarding@resend.dev>';

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

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ error: 'Name, email, and message are required.' });
  if (!RESEND_API_KEY) return res.status(503).json({ error: 'Email service is not configured.' });

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to: [CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `FIT73 contact message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error('Contact email error:', details);
      return res.status(502).json({ error: 'Email provider rejected the message.' });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('Contact email error:', error);
    return res.status(500).json({ error: 'Unable to send contact message.' });
  }
});

app.listen(PORT, () => {
  console.log(`Gemini proxy running on http://localhost:${PORT}`);
});
