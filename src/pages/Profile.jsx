import { useEffect, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { getSession, updateUserMetadata } from '../services/supabase';

export default function Profile() {
  const [profile, setProfile] = useState({ full_name: '', email: '', weight: '', height: '', age: '', gender: 'male', goal: 'Maintenance', image: '' });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [bmr, setBmr] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await getSession();
        const remoteProfile = data.session?.user?.user_metadata?.profile;
        const localProfile = JSON.parse(localStorage.getItem('fit73-profile') || 'null');
        const stored = remoteProfile || localProfile;
        if (!stored) return;
        setProfile((current) => ({
          full_name: stored.full_name || current.full_name,
          email: stored.email || data.session?.user?.email || current.email,
          weight: stored.weight || current.weight,
          height: stored.height || current.height,
          age: stored.age || current.age,
          gender: stored.gender || current.gender,
          goal: stored.goal || current.goal,
          image: stored.image || current.image,
        }));
      } catch {
        // ignore unavailable account or invalid saved profile
      }
    };

    loadProfile();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [profile.full_name, profile.email, profile.weight, profile.height, profile.age, profile.gender, profile.goal, profile.image];
    if (requiredFields.some((field) => !String(field || '').trim())) {
      setSaved(false);
      setError('Please enter all fields to save your profile.');
      return;
    }

    try {
      localStorage.setItem('fit73-profile', JSON.stringify(profile));
      const { error: remoteError } = await updateUserMetadata(profile);
      if (remoteError) throw remoteError;
      setSaved(true);
      setError('');
    } catch {
      setSaved(false);
      setError('Unable to save your profile to your account right now.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => setProfile((current) => ({ ...current, image: reader.result }));
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-brand-black px-4 py-16 text-brand-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Profile" title="Own your metrics" description="Update your profile and keep your dashboard aligned with your goals." />
        <form onSubmit={handleSubmit} className="rounded-[32px] border border-brand-white/10 bg-brand-white/8 p-8 backdrop-blur-xl">
          <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row">
            {profile.image ? (
              <img src={profile.image} alt="Profile" className="h-24 w-24 rounded-full border-2 border-brand-red/40 object-cover" />
            ) : (
              <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border border-dashed border-brand-red/50 bg-brand-black/30 text-brand-red transition hover:bg-brand-red/10">
                <span className="text-3xl leading-none">+</span>
                <span className="mt-1 text-xs font-semibold">Add image</span>
                <input type="file" accept="image/*" onChange={handleImageChange} required={!profile.image} className="sr-only" />
              </label>
            )}
            {profile.image ? (
              <label className="cursor-pointer text-sm text-brand-gray transition hover:text-brand-red">
                <span className="block font-semibold text-brand-white">Profile image</span>
                <span className="mt-1 block">Change image</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
              </label>
            ) : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input value={profile.full_name || ''} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} placeholder="Name" required className="rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 outline-none" />
            <input type="email" value={profile.email || ''} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="Email" required className="rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 outline-none" />
            <input value={profile.weight || ''} onChange={(e) => setProfile({ ...profile, weight: e.target.value })} placeholder="Weight (kg)" required className="rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 outline-none" />
            <input value={profile.height || ''} onChange={(e) => setProfile({ ...profile, height: e.target.value })} placeholder="Height (cm)" required className="rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 outline-none" />
            <input value={profile.age || ''} onChange={(e) => setProfile({ ...profile, age: e.target.value })} placeholder="Age" required className="rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 outline-none" />
            <select value={profile.gender || 'male'} onChange={(e) => setProfile({ ...profile, gender: e.target.value })} required className="rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 outline-none">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <select value={profile.goal || 'Maintenance'} onChange={(e) => setProfile({ ...profile, goal: e.target.value })} required className="rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 outline-none md:col-span-2">
              <option>Weight Loss</option>
              <option>Muscle Gain</option>
              <option>Maintenance</option>
            </select>
          </div>
          <button type="submit" className="mt-6 rounded-full bg-gradient-to-r from-brand-red to-brand-red px-6 py-3 font-semibold">Save Profile</button>
          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
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
