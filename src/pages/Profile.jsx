import { useEffect, useState } from 'react';
import SectionHeading from '../components/SectionHeading';

export default function Profile() {
  const [profile, setProfile] = useState({ full_name: '', email: '', weight: '', height: '', age: '', gender: 'male', goal: 'Maintenance' });
  const [saved, setSaved] = useState(false);
  const [bmr, setBmr] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('fit73-profile');
      if (!raw) return;
      const stored = JSON.parse(raw);
      setProfile((current) => ({
        full_name: stored.full_name || current.full_name,
        email: stored.email || current.email,
        weight: stored.weight || current.weight,
        height: stored.height || current.height,
        age: stored.age || current.age,
        gender: stored.gender || current.gender,
        goal: stored.goal || current.goal,
      }));
    } catch {
      // ignore invalid saved profile
    }
  }, []);

  useEffect(() => {
    const weight = Number(profile.weight);
    const height = Number(profile.height);
    const age = Number(profile.age);
    if (!weight || !height || !age) {
      setBmr(null);
      return;
    }

    const result = 10 * weight + 6.25 * height - 5 * age + (profile.gender === 'male' ? 5 : -161);
    setBmr(Math.round(result));
  }, [profile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('fit73-profile', JSON.stringify(profile));
      setSaved(true);
    } catch {
      setSaved(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black px-4 py-16 text-brand-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Profile" title="Own your metrics" description="Update your profile and keep your dashboard aligned with your goals." />
        <form onSubmit={handleSubmit} className="rounded-[32px] border border-brand-white/10 bg-brand-white/8 p-8 backdrop-blur-xl">
          <div className="grid gap-4 md:grid-cols-2">
            <input value={profile.full_name || ''} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} placeholder="Name" className="rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 outline-none" />
            <input value={profile.email || ''} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="Email" className="rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 outline-none" />
            <input value={profile.weight || ''} onChange={(e) => setProfile({ ...profile, weight: e.target.value })} placeholder="Weight (kg)" className="rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 outline-none" />
            <input value={profile.height || ''} onChange={(e) => setProfile({ ...profile, height: e.target.value })} placeholder="Height (cm)" className="rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 outline-none" />
            <input value={profile.age || ''} onChange={(e) => setProfile({ ...profile, age: e.target.value })} placeholder="Age" className="rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 outline-none" />
            <select value={profile.gender || 'male'} onChange={(e) => setProfile({ ...profile, gender: e.target.value })} className="rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 outline-none">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <select value={profile.goal || 'Maintenance'} onChange={(e) => setProfile({ ...profile, goal: e.target.value })} className="rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 outline-none md:col-span-2">
              <option>Weight Loss</option>
              <option>Muscle Gain</option>
              <option>Maintenance</option>
            </select>
          </div>
          <button type="submit" className="mt-6 rounded-full bg-gradient-to-r from-brand-red to-brand-red px-6 py-3 font-semibold">Save Profile</button>
          {saved ? <p className="mt-4 text-sm text-brand-red">Profile updated locally for this session.</p> : null}
        </form>
        {bmr ? (
          <div className="mt-8 rounded-[32px] border border-brand-white/10 bg-brand-black/30 p-8 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.35em] text-brand-red">Your BMR</p>
            <p className="mt-3 text-3xl font-semibold text-brand-white">{bmr} kcal/day</p>
            <p className="mt-2 max-w-2xl text-brand-gray">Based on your saved weight, height, age, and gender.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
