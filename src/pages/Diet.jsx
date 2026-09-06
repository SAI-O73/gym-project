import SectionHeading from '../components/SectionHeading';
import { useEffect, useState } from 'react';
import { getDietStats, getPersonalizedDietPlans } from '../services/dietPlans';

export default function Diet() {
  const [dietStats, setDietStats] = useState(null);

  useEffect(() => {
    const loadStats = (profileOverride) => {
      try {
        const profile = profileOverride || JSON.parse(localStorage.getItem('fit73-profile') || 'null');
        const homeStats = JSON.parse(localStorage.getItem('fit73-home-stats') || 'null');
        setDietStats(getDietStats(profile, homeStats));
      } catch {
        setDietStats(null);
      }
    };

    loadStats();
    const handleProfileUpdate = (event) => loadStats(event.detail);
    window.addEventListener('fit73-profile-updated', handleProfileUpdate);
    window.addEventListener('fit73-home-stats-updated', () => loadStats());
    return () => window.removeEventListener('fit73-profile-updated', handleProfileUpdate);
  }, []);

  const adjustedPlans = getPersonalizedDietPlans(dietStats);

  return (
    <div className="min-h-screen bg-brand-black px-4 py-16 text-brand-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Diet Plans" title="Nutrition strategies that feel effortless" description={dietStats ? 'Targets updated from your saved profile.' : 'Save your profile or calculate your BMR on Home to personalize these nutrition targets.'} />
        <div className="mb-8 rounded-[20px] border border-brand-white/10 bg-brand-black/30 p-4">
          <p className="text-sm uppercase tracking-[0.35em] text-brand-red">Your Profile</p>
          {dietStats ? (
            <div className="mt-4 grid gap-3 text-sm text-brand-gray sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-brand-white/10 p-3"><p className="text-xs uppercase tracking-[0.25em]">Body Weight</p><p className="mt-1 text-lg font-semibold text-brand-white">{dietStats.weight} kg</p></div>
              <div className="rounded-2xl bg-brand-white/10 p-3"><p className="text-xs uppercase tracking-[0.25em]">Height</p><p className="mt-1 text-lg font-semibold text-brand-white">{dietStats.height} cm</p></div>
              <div className="rounded-2xl bg-brand-white/10 p-3"><p className="text-xs uppercase tracking-[0.25em]">Age / Gender</p><p className="mt-1 text-lg font-semibold text-brand-white">{dietStats.age} / {dietStats.gender}</p></div>
              <div className="rounded-2xl border border-brand-red/30 bg-brand-red/10 p-3"><p className="text-xs uppercase tracking-[0.25em] text-brand-red">Current BMR</p><p className="mt-1 text-lg font-semibold text-brand-white">{dietStats.bmr} kcal/day</p></div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-brand-gray">Save your profile or enter your values in Home to personalize your plans.</p>
          )}
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {adjustedPlans.map((plan) => (
            <div key={plan.title} className="rounded-[28px] border border-brand-white/10 bg-brand-white/8 p-6 backdrop-blur-xl">
              <div className="text-4xl">{plan.icon}</div>
              <h3 className="mt-4 text-xl font-semibold">{plan.title}</h3>
              <div className="mt-4 space-y-3 text-sm text-brand-gray">
                <div className="flex items-center justify-between rounded-2xl bg-brand-white/10 px-3 py-2"><span>Calories</span><span className="font-semibold text-brand-white">{plan.calories}</span></div>
                <div className="flex items-center justify-between rounded-2xl bg-brand-white/10 px-3 py-2"><span>Protein</span><span className="font-semibold text-brand-white">{plan.protein}</span></div>
                <div className="flex items-center justify-between rounded-2xl bg-brand-white/10 px-3 py-2"><span>Carbs</span><span className="font-semibold text-brand-white">{plan.carbs}</span></div>
                <div className="flex items-center justify-between rounded-2xl bg-brand-white/10 px-3 py-2"><span>Fat</span><span className="font-semibold text-brand-white">{plan.fat}</span></div>
              </div>
              <p className="mt-5 text-sm text-brand-gray">{plan.meals} meals per day • Adapted for sustainable progress.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
