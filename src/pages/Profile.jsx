import { useEffect, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { deleteUserAccount, getSession, getUserProfile, saveUserProfile, signOut, updateUserMetadata } from '../services/supabase';

export default function Profile() {
  const [profile, setProfile] = useState({ full_name: '', email: '', weight: '', height: '', age: '', gender: 'male', goal: 'Maintenance', image: '' });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [bmr, setBmr] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await getSession();
        const userId = data.session?.user?.id;
        const { data: tableProfile } = userId ? await getUserProfile(userId) : { data: null };
        const remoteProfile = tableProfile || data.session?.user?.user_metadata?.profile;
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
      window.dispatchEvent(new CustomEvent('fit73-profile-updated', { detail: profile }));
      const { data: sessionData } = await getSession();
      const userId = sessionData.session?.user?.id;
      const { error: tableError } = await saveUserProfile(userId, profile);
      if (tableError) throw tableError;
      try {
        await updateUserMetadata(profile);
      } catch {}
      setSaved(true);
      setError('');
    } catch (saveError) {
      setSaved(false);
      console.error('Profile save failed:', saveError);
      setError(saveError?.message || 'Unable to save your profile to your account right now.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => setProfile((current) => ({ ...current, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setError('');
    try {
      const { data } = await getSession();
      if (!data.session?.user?.id) throw new Error('You must be signed in to delete your account.');
      const { error: deleteError } = await deleteUserAccount();
      if (deleteError) throw deleteError;

      localStorage.removeItem('fit73-profile');
      localStorage.removeItem('fit73-home-stats');
      localStorage.removeItem('fit73-saved-credentials');
      window.dispatchEvent(new CustomEvent('fit73-profile-updated', { detail: null }));
      await signOut();
      window.location.href = '/';
    } catch (deleteError) {
      setDeleting(false);
      setShowDeleteConfirm(false);
      setError(deleteError?.message || 'Unable to delete your account. Run the latest profiles.sql in Supabase SQL Editor and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-black px-4 py-16 text-brand-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Profile" title="Own your metrics" description="Keep your body data, goals, and nutrition targets in one place." />
        <form onSubmit={handleSubmit} className="rounded-[32px] border border-brand-white/10 bg-brand-white/8 p-6 backdrop-blur-xl sm:p-8">
          <div className="mb-8 flex flex-col items-center gap-5 rounded-3xl border border-brand-white/10 bg-brand-black/25 p-5 sm:flex-row">
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
          <div className="mb-4 flex items-center justify-between border-b border-brand-white/10 pb-4">
            <div>
              <h2 className="text-xl font-semibold">Personal details</h2>
              <p className="mt-1 text-sm text-brand-gray">These values personalize your BMR and diet plans.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-brand-gray">Full name<input value={profile.full_name || ''} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} placeholder="Your name" required className="w-full rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 text-brand-white outline-none transition focus:border-brand-red/60 focus:ring-2 focus:ring-brand-red/20" /></label>
            <label className="space-y-2 text-sm text-brand-gray">Email<input type="email" value={profile.email || ''} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="you@example.com" required className="w-full rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 text-brand-white outline-none transition focus:border-brand-red/60 focus:ring-2 focus:ring-brand-red/20" /></label>
            <label className="space-y-2 text-sm text-brand-gray">Weight (kg)<input value={profile.weight || ''} onChange={(e) => setProfile({ ...profile, weight: e.target.value })} placeholder="e.g. 75" required className="w-full rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 text-brand-white outline-none transition focus:border-brand-red/60 focus:ring-2 focus:ring-brand-red/20" /></label>
            <label className="space-y-2 text-sm text-brand-gray">Height (cm)<input value={profile.height || ''} onChange={(e) => setProfile({ ...profile, height: e.target.value })} placeholder="e.g. 180" required className="w-full rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 text-brand-white outline-none transition focus:border-brand-red/60 focus:ring-2 focus:ring-brand-red/20" /></label>
            <label className="space-y-2 text-sm text-brand-gray">Age<input value={profile.age || ''} onChange={(e) => setProfile({ ...profile, age: e.target.value })} placeholder="e.g. 25" required className="w-full rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 text-brand-white outline-none transition focus:border-brand-red/60 focus:ring-2 focus:ring-brand-red/20" /></label>
            <label className="space-y-2 text-sm text-brand-gray">Gender<select value={profile.gender || 'male'} onChange={(e) => setProfile({ ...profile, gender: e.target.value })} required style={{ colorScheme: 'dark' }} className="w-full rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 text-brand-white outline-none transition focus:border-brand-red/60 focus:ring-2 focus:ring-brand-red/20">
              <option value="male" className="bg-brand-black text-brand-white">Male</option>
              <option value="female" className="bg-brand-black text-brand-white">Female</option>
            </select></label>
            <label className="space-y-2 text-sm text-brand-gray md:col-span-2">Primary goal<select value={profile.goal || 'Maintenance'} onChange={(e) => setProfile({ ...profile, goal: e.target.value })} required style={{ colorScheme: 'dark' }} className="w-full rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 text-brand-white outline-none transition focus:border-brand-red/60 focus:ring-2 focus:ring-brand-red/20">
              <option className="bg-brand-black text-brand-white">Weight Loss</option>
              <option className="bg-brand-black text-brand-white">Muscle Gain</option>
              <option className="bg-brand-black text-brand-white">Maintenance</option>
            </select></label>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="submit" className="rounded-full bg-brand-red px-6 py-3 font-semibold transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-brand-red/40">Save Profile</button>
            <span className="text-xs text-brand-gray">Your profile powers your personalized diet targets.</span>
          </div>
          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
          {saved ? <p className="mt-4 text-sm text-brand-red">Your profile is saved.</p> : null}
          <div className="mt-8 border-t border-brand-white/10 pt-6">
            <button type="button" onClick={() => setShowDeleteConfirm(true)} className="rounded-full border border-red-400/40 px-5 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/10">Delete Account</button>
          </div>
        </form>
        {bmr ? (
          <div className="mt-8 rounded-[32px] border border-brand-white/10 bg-brand-black/30 p-8 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.35em] text-brand-red">Your BMR</p>
            <p className="mt-3 text-3xl font-semibold text-brand-white">{bmr} kcal/day</p>
            <p className="mt-2 max-w-2xl text-brand-gray">Based on your saved weight, height, age, and gender.</p>
          </div>
        ) : null}
      </div>
      {showDeleteConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="delete-account-title">
          <div className="w-full max-w-md rounded-3xl border border-brand-white/10 bg-brand-black p-6 shadow-2xl">
            <h2 id="delete-account-title" className="text-xl font-semibold">Do you want to delete your account?</h2>
            <p className="mt-3 text-sm text-brand-gray">Your profile, saved fitness values, and local account data will be deleted and you will be signed out.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" disabled={deleting} onClick={() => setShowDeleteConfirm(false)} className="rounded-full border border-brand-white/20 px-5 py-2.5 text-sm font-semibold text-brand-gray transition hover:bg-brand-white/10">Cancel</button>
              <button type="button" disabled={deleting} onClick={handleDeleteAccount} className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700">{deleting ? 'Deleting...' : 'OK'}</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
