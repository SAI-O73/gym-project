import { useState } from 'react';

export default function Dashboard() {
  const [profile] = useState(null);

  return (
    <div className="min-h-screen bg-brand-black px-4 py-16 text-brand-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[32px] border border-brand-white/10 bg-gradient-to-br from-brand-red/10 via-brand-white/5 to-brand-red/10 p-8 backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-red">Dashboard</p>
          <h2 className="mt-3 text-3xl font-semibold">Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}</h2>
          <p className="mt-3 max-w-2xl text-brand-gray">Your metrics, meal strategy, and AI support are ready for today.</p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Calories', value: '2,240', tone: 'cyan' },
            { label: 'Protein', value: '145g', tone: 'fuchsia' },
            { label: 'Water', value: '3.2L', tone: 'cyan' },
            { label: 'BMI', value: '24.2', tone: 'fuchsia' },
          ].map((item) => (
            <div key={item.label} className="rounded-[24px] border border-brand-white/10 bg-brand-white/8 p-6 backdrop-blur-xl">
              <p className="text-sm text-brand-gray">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold text-brand-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
