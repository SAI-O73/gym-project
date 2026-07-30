import axios from 'axios';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

export async function askGemini(message) {
  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    return 'Ask me about workouts, nutrition, protein, recovery, or fat loss.';
  }

  if (!apiKey) {
    return 'AI Coach is ready. Add your Gemini API key to unlock live coaching responses.';
  }

  const prompt = `You are an elite AI fitness coach. Respond only to fitness, nutrition, workout, recovery, fat loss, muscle gain, protein, hydration, supplements, and general health-related questions. If the user asks something unrelated, reply exactly: "I'm your AI Fitness Coach. Please ask only fitness, nutrition, workout or health related questions."\n\nUser: ${trimmedMessage}`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
  } catch (error) {
    return 'The AI coach is unavailable right now. Please check your Gemini API key and try again.';
  }
}
