import { useState } from 'react';
import SectionHeading from '../components/SectionHeading';

const formulas = {
  'Weight Loss': 1.6,
  'Muscle Gain': 2.2,
  Maintenance: 1.2,
};

export default function Protein() {
  const [weight, setWeight] = useState('75');
  const [goal, setGoal] = useState('Weight Loss');
  const [result, setResult] = useState(null);

  const calculate = (e) => {
    e.preventDefault();
    const grams = Number(weight) * formulas[goal];
    const calories = grams * 4;
    const water = Number(weight) * 35;
    setResult({ grams: grams.toFixed(0), calories: calories.toFixed(0), water: water.toFixed(0) });
  };

  return (
    <div className="min-h-screen bg-black px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Protein Calculator" title="Calculate your daily protein target" description="Use your body weight and goal to estimate the right intake." />
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <form onSubmit={calculate} className="rounded-[32px] border border-white/10 bg-white/8 p-6 backdrop-blur-xl">
            <label className="mb-4 block text-sm text-slate-400">Body Weight (kg)</label>
            <input value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none" />
            <label className="mb-4 mt-6 block text-sm text-slate-400">Goal</label>
            <select value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none">
              {Object.keys(formulas).map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            <button type="submit" className="mt-6 w-full rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-3 font-semibold">Calculate</button>
          </form>

          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-cyan-500/10 via-white/5 to-fuchsia-500/10 p-8 backdrop-blur-xl">
            <h3 className="text-2xl font-semibold">Formula</h3>
            <div className="mt-6 space-y-3 text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">Weight Loss → 1.6g × Body Weight</div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">Muscle Gain → 2.2g × Body Weight</div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">Maintenance → 1.2g × Body Weight</div>
            </div>
            {result ? (
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[24px] border border-white/10 bg-black/30 p-4 text-center">
                  <p className="text-sm text-slate-400">Protein Needed</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{result.grams}g</p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-black/30 p-4 text-center">
                  <p className="text-sm text-slate-400">Calories</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{result.calories} kcal</p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-black/30 p-4 text-center">
                  <p className="text-sm text-slate-400">Water Intake</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{result.water} ml</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
