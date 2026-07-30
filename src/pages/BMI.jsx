import { useState } from 'react';
import SectionHeading from '../components/SectionHeading';

export default function BMI() {
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('70');
  const [result, setResult] = useState(null);

  const calculate = (e) => {
    e.preventDefault();
    const bmi = Number(weight) / ((Number(height) / 100) ** 2);
    let category = 'Healthy';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Healthy';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';
    setResult({ bmi: bmi.toFixed(1), category });
  };

  return (
    <div className="min-h-screen bg-black px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="BMI Calculator" title="A quick body composition snapshot" description="Track your baseline and adjust your plan with confidence." />
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <form onSubmit={calculate} className="rounded-[32px] border border-white/10 bg-white/8 p-6 backdrop-blur-xl">
            <label className="mb-4 block text-sm text-slate-400">Height (cm)</label>
            <input value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none" />
            <label className="mb-4 mt-6 block text-sm text-slate-400">Weight (kg)</label>
            <input value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none" />
            <button type="submit" className="mt-6 w-full rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-3 font-semibold">Calculate BMI</button>
          </form>

          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-cyan-500/10 via-white/5 to-fuchsia-500/10 p-8 backdrop-blur-xl">
            {result ? (
              <div className="space-y-4">
                <div className="rounded-[24px] border border-white/10 bg-black/30 p-6 text-center">
                  <p className="text-sm text-slate-400">BMI</p>
                  <p className="mt-2 text-4xl font-semibold text-white">{result.bmi}</p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-black/30 p-6 text-center">
                  <p className="text-sm text-slate-400">Category</p>
                  <p className="mt-2 text-2xl font-semibold text-cyan-300">{result.category}</p>
                </div>
              </div>
            ) : (
              <div className="rounded-[24px] border border-white/10 bg-black/30 p-8 text-slate-400">Your BMI and category will appear here after calculation.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
