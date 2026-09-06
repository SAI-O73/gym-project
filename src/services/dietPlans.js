export const baseDietPlans = [
  { title: 'Weight Loss', calories: '1800', protein: '120g', carbs: '180g', fat: '55g', meals: '4', icon: '🔥' },
  { title: 'Muscle Gain', calories: '2600', protein: '180g', carbs: '320g', fat: '70g', meals: '5', icon: '💪' },
  { title: 'Maintenance', calories: '2200', protein: '145g', carbs: '250g', fat: '60g', meals: '4', icon: '⚖️' },
];

const calorieAdjustments = {
  'Weight Loss': -400,
  'Muscle Gain': 300,
  Maintenance: 0,
};

const proteinMultipliers = {
  'Weight Loss': 1.6,
  'Muscle Gain': 2,
  Maintenance: 1.6,
};

export function getDietStats(profile, homeStats) {
  const source = profile?.weight && profile?.height && profile?.age ? profile : homeStats;
  if (!source?.weight || !source?.height || !source?.age) return null;

  const weight = Number(source.weight);
  const height = Number(source.height);
  const age = Number(source.age);
  if (weight <= 0 || height <= 0 || age <= 0) return null;

  return {
    ...source,
    weight,
    height,
    age,
    bmr: Math.round(10 * weight + 6.25 * height - 5 * age + (source.gender === 'male' ? 5 : -161)),
  };
}

export function getPersonalizedDietPlans(homeStats) {
  return baseDietPlans.map((plan) => {
    if (!homeStats?.bmr || !homeStats?.weight) return plan;

    const activityCalories = Math.round((homeStats.bmr * 1.4) / 50) * 50;
    const calories = Math.max(1200, activityCalories + calorieAdjustments[plan.title]);
    const protein = Math.round(homeStats.weight * proteinMultipliers[plan.title]);
    const fat = Math.round((calories * 0.25) / 9);
    const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));

    return {
      ...plan,
      calories: String(calories),
      protein: `${protein}g`,
      carbs: `${carbs}g`,
      fat: `${fat}g`,
    };
  });
}

export function getPersonalizedDietPlan(title, homeStats) {
  return getPersonalizedDietPlans(homeStats).find((plan) => plan.title === title) || getPersonalizedDietPlans(homeStats)[0];
}
