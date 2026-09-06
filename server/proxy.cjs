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

// Simple token-bucket rate limiting to avoid sending too many requests to Gemini
const RATE_LIMIT_PER_SEC = Number(process.env.GEMINI_RATE_LIMIT_PER_SEC || 3);
let tokens = RATE_LIMIT_PER_SEC;
let lastRefill = Date.now();

function refillTokens() {
  const now = Date.now();
  const elapsed = (now - lastRefill) / 1000;
  if (elapsed <= 0) return;
  const refill = elapsed * RATE_LIMIT_PER_SEC;
  tokens = Math.min(RATE_LIMIT_PER_SEC, tokens + refill);
  lastRefill = now;
}

async function acquireToken() {
  // wait until a token is available
  while (true) {
    refillTokens();
    if (tokens >= 1) {
      tokens -= 1;
      return;
    }
    await new Promise((r) => setTimeout(r, 200));
  }
}

if (!GEMINI_KEY) {
  console.warn('Warning: GEMINI_API_KEY is not set. Proxy will return an error for requests.');
}

app.post('/ask', async (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'Missing message' });
  if (!GEMINI_KEY) return res.status(500).json({ error: 'Server missing Gemini API key' });

  const prompt = `You are the helpful AI assistant for the FIT73 website. Answer questions about every part of the website, including Home, BMR, protein calculator, diet plans, workout plans, profile, account settings, email verification, contact, navigation, and AI Coach features. You can also answer fitness, nutrition, workout, recovery, and general health questions. Give clear, practical answers based on the user's question. If you are unsure about a website-specific detail, say so instead of inventing it.\n\nUser: ${message}`;

  try {
    // throttle requests to avoid hitting Gemini rate limits
    await acquireToken();

    // retry with exponential backoff on 429
    const maxRetries = 3;
    let attempt = 0;
    let lastError = null;
    while (attempt < maxRetries) {
      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
          { contents: [{ parts: [{ text: prompt }] }] },
          { headers: { 'Content-Type': 'application/json' } }
        );
        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
        return res.json({ text });
      } catch (err) {
        lastError = err;
        const status = err?.response?.status;
        console.warn(`Gemini request failed (attempt ${attempt + 1}):`, status || err.message || err);
        if (status === 429) {
          // backoff and retry
          const backoffMs = 500 * Math.pow(2, attempt);
          await new Promise((r) => setTimeout(r, backoffMs));
          attempt += 1;
          continue;
        }
        // non-retryable
        break;
      }
    }
    console.error('Proxy error', lastError?.response?.data || lastError?.message || lastError);
    const status = lastError?.response?.status || 500;
    res.status(status).json({ error: lastError?.response?.data || lastError?.message || 'AI service error' });
  } catch (err) {
    console.error('Proxy unexpected error', err);
    res.status(500).json({ error: 'Internal proxy error' });
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
