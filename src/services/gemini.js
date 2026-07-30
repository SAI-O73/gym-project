import axios from 'axios';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

export async function askGemini(message) {
  if (!apiKey) {
    return 'AI Coach is ready. Configure VITE_GEMINI_API_KEY to unlock live responses.';
  }

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      contents: [
        {
          parts: [
            {
              text: `You are an elite AI fitness coach. Answer only fitness, nutrition, workout, recovery, or health-related questions. If the user asks unrelated questions, reply exactly: "I'm your AI Fitness Coach. Please ask only fitness, nutrition, workout or health related questions."\n\nUser: ${message}`,
            },
          ],
        },
      ],
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
}
