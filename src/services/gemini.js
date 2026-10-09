import axios from 'axios';

const proxyUrl = import.meta.env.VITE_GEMINI_PROXY_URL || '';

function fallbackCoachAnswer(message) {
  const lower = message.trim().toLowerCase();

  if (/^(hi|hello|hey|hey there|hi there|good morning|good evening|good afternoon|good night|yo|sup|howdy|namaste)$/i.test(lower.trim())) {
    return '👋 Hey! Welcome to RUDRAFIT. I can help with your workouts, diet, protein, BMR, profile, and training goals.';
  }

  if (/(how are you|how are you doing|what's up|wassup|whats up)/.test(lower)) {
    return '😊 I’m doing great and ready to help you with training, nutrition, and your RUDRAFIT goals.';
  }

  if (/(thanks|thank you|thankyou|ty)/.test(lower)) {
    return '🙏 You’re welcome! I’m here to help with your fitness plan, goals, and RUDRAFIT app guidance.';
  }

  if (/(bye|goodbye|see you|talk later)/.test(lower)) {
    return '👋 Take care and keep pushing forward. I’ll be here whenever you want help with your RUDRAFIT goals.';
  }

  if (/(home|homepage|landing|hero|theme|brand|design|layout)/.test(lower)) {
    return '✨ The RUDRAFIT homepage is built around a bold black-and-red premium fitness aesthetic. It highlights the hero section, BMR calculator, protein calculator, diet plans, and workout library. Use the Home tab to start, then go to Profile to personalize your stats.';
  }

  if (/(profile|account|save|edit|metrics|bmr|weight|height|age|gender)/.test(lower)) {
    return '📊 Update your personal metrics in the Profile page, then the BMR and protein tools use that data to generate personalized recommendations. Save your profile so your information remains synced and accessible on your account.';
  }

  if (/(protein|diet|nutrition|meal|plan)/.test(lower)) {
    return '🥗 For RUDRAFIT-style nutrition, aim for protein at each meal, keep your meal plan aligned to your goal, and use the Protein Calculator plus Diet page to match your calories and macro targets to your goal.';
  }

  if (/(workout|training|exercise|plan)/.test(lower)) {
    return '💪 For general fitness, focus on a mix of strength training and cardio. Start with 3 full-body sessions per week and add walking or light activity on recovery days, then align the workout plan to your goal in the app.';
  }

  if (/(recovery|rest|sleep|coach)/.test(lower)) {
    return '😴 Recovery is essential: aim for 7–9 hours of sleep, stay hydrated, and use light stretching or foam rolling post-session. The AI Coach can suggest structure around recovery, effort, and consistency.';
  }

  if (/(weight|fat|lose|gain|muscle)/.test(lower)) {
    return '🔥 A small daily calorie deficit helps fat loss, while a slight surplus plus progressive strength training supports muscle growth. Keep the plan simple and consistent with your app data.';
  }

  return '⚠️ The RUDRAFIT AI assistant is temporarily unavailable. Please try again shortly or use the Home, Diet, Workout, Profile, BMR, and AI Coach pages directly.';
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
