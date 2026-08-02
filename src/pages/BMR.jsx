import { useState } from 'react';
import SectionHeading from '../components/SectionHeading';

const activityOptions = {
  sedentary: {
    label: 'Little or no exercise, desk job',
    multiplier: 1.2,
    description: 'Little or no exercise, desk job',
  },
  lightly_active: {
    label: 'Lightly Active — Exercise 1–3 days per week',
    multiplier: 1.375,
    description: 'Exercise 1–3 days per week',
  },
  moderately_active: {
    label: 'Moderately Active — Exercise 3–5 days per week',
    multiplier: 1.55,
    description: 'Exercise 3–5 days per week',
  },
  very_active: {
    label: 'Very Active — Hard exercise 6–7 days per week',
    multiplier: 1.725,
    description: 'Hard exercise 6–7 days per week',
  },
  extra_active: {
    label: 'Extra Active — Very hard physical job or intense training twice a day',
    multiplier: 1.9,
    description: 'Very hard physical job or intense training twice a day',
  },
};

export default function BMR() {
  const [weight, setWeight] = useState('75');
  const [height, setHeight] = useState('180');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activity, setActivity] = useState('sedentary');
  const [bmr, setBmr] = useState(null);
  const [tdee, setTdee] = useState(null);

  const calculate = (e) => {
    e.preventDefault();
    const w = Number(weight);
    const h = Number(height);
    const a = Number(age);
    if (!w || !h || !a) return;
    const baseBmr = 10 * w + 6.25 * h - 5 * a + (gender === 'male' ? 5 : -161);
    const roundedBmr = Math.round(baseBmr);
    setBmr(roundedBmr);
    const multiplier = activityOptions[activity]?.multiplier || 1;
    setTdee(Math.round(roundedBmr * multiplier));
  };

  return (
    <div className="min-h-screen bg-brand-black px-4 py-16 text-brand-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="BMR Calculator"
          title="Estimate your daily energy needs"
          description="Enter your weight, height, age, gender, and activity level to calculate BMR and TDEE."
        />

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <form onSubmit={calculate} className="rounded-[32px] border border-brand-white/10 bg-brand-white/8 p-6 backdrop-blur-xl">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-brand-gray">
                Body Weight (kg)
                <input
                  type="number"
                  min="1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 outline-none"
                  placeholder="75"
                  required
                />
              </label>
              <label className="block text-sm text-brand-gray">
                Height (cm)
                <input
                  type="number"
                  min="1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 outline-none"
                  placeholder="180"
                  required
                />
              </label>
              <label className="block text-sm text-brand-gray">
                Age
                <input
                  type="number"
                  min="1"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 outline-none"
                  placeholder="25"
                  required
                />
              </label>
              <div className="space-y-2">
                <p className="text-sm text-brand-gray">Gender</p>
                <div className="mt-2 flex flex-wrap gap-3">
                  <label className="inline-flex items-center gap-2 rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 text-sm">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === 'male'}
                      onChange={(e) => setGender(e.target.value)}
                      className="h-4 w-4 accent-brand-red"
                    />
                    Male
                  </label>
                  <label className="inline-flex items-center gap-2 rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 text-sm">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === 'female'}
                      onChange={(e) => setGender(e.target.value)}
                      className="h-4 w-4 accent-brand-red"
                    />
                    Female
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-brand-gray">Activity Level</p>
              <div className="mt-3 grid gap-3">
                {Object.entries(activityOptions).map(([key, opt]) => (
                  <label
                    key={key}
                    className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-colors ${activity === key ? 'border-brand-red bg-brand-black/50' : 'border-brand-white/10 bg-brand-black/30'}`}
                  >
                    <input
                      type="radio"
                      name="activity"
                      value={key}
                      checked={activity === key}
                      onChange={(e) => setActivity(e.target.value)}
                      className="mt-1 h-4 w-4 accent-brand-red"
                    />
                    <div>
                      <p className="text-sm font-semibold text-brand-white">{opt.label}</p>
                      <p className="mt-1 text-xs text-brand-gray">Multiplier: {opt.multiplier} — {opt.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-gradient-to-r from-brand-red to-brand-red px-4 py-3 font-semibold"
            >
              Calculate BMR
            </button>
          </form>

          <div className="rounded-[32px] border border-brand-white/10 bg-gradient-to-br from-brand-red/10 via-brand-white/5 to-brand-red/10 p-8 backdrop-blur-xl">
            <h3 className="text-2xl font-semibold">BMR & TDEE Results</h3>
            <p className="mt-3 text-sm text-brand-gray">Your daily energy baseline and maintenance estimate from the inputs above.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-brand-white/10 bg-brand-black/30 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-brand-gray">Estimated BMR</p>
                <p className="mt-3 text-3xl font-semibold text-brand-white">{bmr ?? '--'} kcal/day</p>
              </div>
              <div className="rounded-[24px] border border-brand-white/10 bg-brand-black/30 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-brand-gray">Estimated TDEE</p>
                <p className="mt-3 text-3xl font-semibold text-brand-white">{tdee ?? '--'} kcal/day</p>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-brand-gray">
              <div className="rounded-2xl border border-brand-white/10 bg-brand-black/30 p-4">
                <p className="text-sm font-semibold text-brand-white">Selected Activity</p>
                <p className="mt-2">{activityOptions[activity]?.label || activity}</p>
                {activityOptions[activity]?.description ? (
                  <p className="mt-2 text-sm text-brand-gray">{activityOptions[activity].description}</p>
                ) : null}
              </div>
              <div className="rounded-2xl border border-brand-white/10 bg-brand-black/30 p-4">
                <p className="text-sm font-semibold text-brand-white">BMR Formula</p>
                <p className="mt-2 text-sm text-brand-gray">10 × weight + 6.25 × height − 5 × age + {gender === 'male' ? '5' : '-161'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
