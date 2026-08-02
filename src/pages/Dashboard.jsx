import { useEffect, useState } from 'react';

function ProfileCard() {
  const [profile, setProfile] = useState({ weight: '75', height: '180', age: '30', gender: 'male' });
  const [bmr, setBmr] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('fit73-profile');
      if (!raw) return;
      const p = JSON.parse(raw);
      setProfile({
        weight: p.weight || '75',
        height: p.height || '180',
        age: p.age || '30',
        gender: p.gender || 'male',
      });
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const weight = Number(profile.weight);
    const height = Number(profile.height);
    const age = Number(profile.age);
    if (!weight || !height || !age) return;
    setBmr(Math.round(10 * weight + 6.25 * height - 5 * age + (profile.gender === 'male' ? 5 : -161)));
  }, [profile]);

  const handleSave = () => {
    localStorage.setItem('fit73-profile', JSON.stringify(profile));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="rounded-[32px] border border-brand-white/10 bg-brand-black/30 p-8 backdrop-blur-xl">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-red">Your Profile</p>
      <h3 className="mt-3 text-2xl font-semibold text-brand-white">Daily energy & body summary</h3>
      <p className="mt-3 text-brand-gray">This card shows your latest stored metrics and your estimated BMR from profile data.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="rounded-3xl border border-brand-white/10 bg-brand-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-brand-gray">Weight</p>
          <input
            type="number"
            min="1"
            value={profile.weight}
            onChange={(e) => setProfile((prev) => ({ ...prev, weight: e.target.value }))}
            className="mt-2 w-full bg-transparent text-xl font-semibold text-brand-white outline-none"
          />
          <span className="text-sm text-brand-gray">kg</span>
        </label>
        <label className="rounded-3xl border border-brand-white/10 bg-brand-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-brand-gray">Height</p>
          <input
            type="number"
            min="1"
            value={profile.height}
            onChange={(e) => setProfile((prev) => ({ ...prev, height: e.target.value }))}
            className="mt-2 w-full bg-transparent text-xl font-semibold text-brand-white outline-none"
          />
          <span className="text-sm text-brand-gray">cm</span>
        </label>
        <label className="rounded-3xl border border-brand-white/10 bg-brand-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-brand-gray">Age</p>
          <input
            type="number"
            min="1"
            value={profile.age}
            onChange={(e) => setProfile((prev) => ({ ...prev, age: e.target.value }))}
            className="mt-2 w-full bg-transparent text-xl font-semibold text-brand-white outline-none"
          />
        </label>
        <label className="rounded-3xl border border-brand-white/10 bg-brand-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-brand-gray">Gender</p>
          <select
            value={profile.gender}
            onChange={(e) => setProfile((prev) => ({ ...prev, gender: e.target.value }))}
            className="mt-2 w-full rounded-2xl border border-brand-white/10 bg-brand-black/30 px-3 py-2 text-brand-white outline-none"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button onClick={handleSave} className="rounded-full bg-gradient-to-r from-brand-red to-brand-red px-5 py-3 text-sm font-semibold">
          Save details
        </button>
        {saved && <span className="text-sm text-brand-gray">Profile saved locally.</span>}
      </div>

      {bmr ? (
        <div className="mt-6 rounded-[24px] border border-brand-white/10 bg-brand-red/10 p-4 text-brand-white">
          <p className="text-xs uppercase tracking-[0.25em] text-brand-red">Estimated BMR</p>
          <p className="mt-2 text-3xl font-semibold">{bmr} kcal/day</p>
        </div>
      ) : null}
    </div>
  );
}

export default function Dashboard() {
  const [profile] = useState(null);

  return (
    <div className="min-h-screen bg-brand-black px-4 py-16 text-brand-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <div className="rounded-[32px] border border-brand-white/10 bg-gradient-to-br from-brand-red/10 via-brand-white/5 to-brand-red/10 p-8 backdrop-blur-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-red">Dashboard</p>
            <h2 className="mt-3 text-3xl font-semibold">Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}</h2>
            <p className="mt-3 max-w-2xl text-brand-gray">Your metrics, meal strategy, and AI support are ready for today.</p>
          </div>
          <ProfileCard />
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
