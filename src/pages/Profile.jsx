import { useState } from 'react';
import SectionHeading from '../components/SectionHeading';

export default function Profile() {
  const [profile, setProfile] = useState({ full_name: '', email: '', weight: '', height: '', goal: 'Maintenance' });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
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
            <select value={profile.goal || 'Maintenance'} onChange={(e) => setProfile({ ...profile, goal: e.target.value })} className="rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 outline-none md:col-span-2">
              <option>Weight Loss</option>
              <option>Muscle Gain</option>
              <option>Maintenance</option>
            </select>
          </div>
          <button type="submit" className="mt-6 rounded-full bg-gradient-to-r from-brand-red to-brand-red px-6 py-3 font-semibold">Save Profile</button>
          {saved ? <p className="mt-4 text-sm text-brand-red">Profile updated locally for this session.</p> : null}
        </form>
      </div>
    </div>
  );
}
