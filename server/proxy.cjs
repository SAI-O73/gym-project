const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

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

  const prompt = `You are an elite AI fitness coach. Respond only to fitness, nutrition, workout, recovery, fat loss, muscle gain, protein, hydration, supplements, and general health-related questions. If the user asks something unrelated, reply exactly: \"I'm your AI Fitness Coach. Please ask only fitness, nutrition, workout or health related questions.\"\n\nUser: ${message}`;

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

app.listen(PORT, () => {
  console.log(`Gemini proxy running on http://localhost:${PORT}`);
});
