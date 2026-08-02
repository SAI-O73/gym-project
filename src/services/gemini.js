import axios from 'axios';

const proxyUrl = import.meta.env.VITE_GEMINI_PROXY_URL || '';

function fallbackCoachAnswer(message) {
  const lower = message.trim().toLowerCase();

  if (/(protein|diet|nutrition)/.test(lower)) {
    return 'Try to get 20–30g of protein per meal from lean sources like chicken, fish, eggs, and legumes. Maintain a balanced plate with vegetables and healthy carbs.';
  }

  if (/(workout|training|exercise)/.test(lower)) {
    return 'For general fitness, focus on a mix of strength training and cardio. Start with 3 full-body sessions per week and add walking or light jogging on alternate days.';
  }

  if (/(recovery|rest|sleep)/.test(lower)) {
    return 'Recovery is essential: aim for 7–9 hours of sleep, stay hydrated, and use light stretching or foam rolling after workouts.';
  }

  if (/(weight|fat|lose|gain|muscle)/.test(lower)) {
    return 'A small daily calorie deficit will help with fat loss, while a slight surplus plus strength training supports muscle growth. Consistency over time matters most.';
  }

  return 'The AI coach is temporarily unavailable due to Gemini quota limits. Please enable billing and request quota to restore live responses.';
}

export async function askGemini(message) {
  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    return 'Ask me about workouts, nutrition, protein, recovery, or fat loss.';
  }

  if (!proxyUrl) {
    return fallbackCoachAnswer(message);
  }

  try {
    const res = await axios.post(
      `${proxyUrl.replace(/\/$/, '')}/ask`,
      {
        message: trimmedMessage
      }
    );

    return res.data?.text || fallbackCoachAnswer(message);

  } catch (err) {
    console.error(
      'Proxy error',
      err?.response?.data || err.message || err
    );

    const status = err?.response?.status;

    if (status === 429) {
      return fallbackCoachAnswer(message);
    }

    const e = new Error('Proxy error');
    e.status = status || 500;
    e.details = err?.response?.data || err.message;

    throw e;
  }
}
