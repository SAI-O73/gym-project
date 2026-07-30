import { useEffect, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { fetchProfile, saveProfile } from '../services/supabase';

export default function Profile() {
  const [profile, setProfile] = useState({ full_name: '', email: '', weight: '', height: '', goal: 'Maintenance' });

  useEffect(() => {
    fetchProfile().then(({ data }) => {
      if (data) setProfile({ ...profile, ...data });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveProfile(profile);
  };

  return (
    <div className="min-h-screen bg-black px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Profile" title="Own your metrics" description="Update your profile and let the dashboard stay in sync." />
        <form onSubmit={handleSubmit} className="rounded-[32px] border border-white/10 bg-white/8 p-8 backdrop-blur-xl">
          <div className="grid gap-4 md:grid-cols-2">
            <input value={profile.full_name || ''} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} placeholder="Name" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none" />
            <input value={profile.email || ''} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="Email" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none" />
            <input value={profile.weight || ''} onChange={(e) => setProfile({ ...profile, weight: e.target.value })} placeholder="Weight (kg)" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none" />
            <input value={profile.height || ''} onChange={(e) => setProfile({ ...profile, height: e.target.value })} placeholder="Height (cm)" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none" />
            <select value={profile.goal || 'Maintenance'} onChange={(e) => setProfile({ ...profile, goal: e.target.value })} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none md:col-span-2">
              <option>Weight Loss</option>
              <option>Muscle Gain</option>
              <option>Maintenance</option>
            </select>
          </div>
          <button type="submit" className="mt-6 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-6 py-3 font-semibold">Save Profile</button>
        </form>
      </div>
    </div>
  );
}
