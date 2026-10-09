import HeroSection from '../components/HeroSection';
import SectionHeading from '../components/SectionHeading';
import { motion } from 'framer-motion';
import { FaDumbbell, FaAppleAlt, FaHeartbeat, FaRunning } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPersonalizedDietPlans } from '../services/dietPlans';
import { getSession, getUserProfile } from '../services/supabase';

const dietPlanImages = {
  'Weight Loss': 'https://i.pinimg.com/736x/08/7b/40/087b4089c161d62e8ca83a1557a44e24.jpg',
  'Muscle Gain': 'https://i.pinimg.com/736x/85/19/04/851904b39e5a95386384cdd1b69973d4.jpg',
  Maintenance: 'https://i.pinimg.com/736x/4f/7b/28/4f7b28ad78d97529b58f7c583f6da873.jpg',
};

const workouts = [
  { title: 'Chest', sets: '4', reps: '10-12', rest: '60s', difficulty: 'Intermediate', image: 'https://i.pinimg.com/736x/ab/66/73/ab66730e17864c56a6f932c86de053d4.jpg' },
  { title: 'Back', sets: '4', reps: '8-10', rest: '75s', difficulty: 'Advanced', image: 'https://i.pinimg.com/736x/cc/0a/da/cc0ada81bd8f5f91bc6133a35436563d.jpg' },
  { title: 'Legs', sets: '5', reps: '8-12', rest: '90s', difficulty: 'Advanced', image: 'https://i.pinimg.com/736x/c1/c4/86/c1c486b9f4bbc17755131504ea00a04d.jpg' },
];

function BmrWidget() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('18');
  const [gender, setGender] = useState('male');
  const [bmr, setBmr] = useState(null);

  useEffect(() => {
    const loadRemoteProfile = async () => {
      try {
        const { data } = await getSession();
        const userId = data.session?.user?.id;

        if (userId) {
          const { data: profileData } = await getUserProfile(userId);
          if (profileData) {
            const p = profileData;
            localStorage.setItem('fit73-profile', JSON.stringify(p));
            if (p.weight) setWeight(String(p.weight));
            if (p.height) setHeight(String(p.height));
            if (p.age) setAge(String(p.age));
            if (p.gender) setGender(p.gender);
            return;
          }
        }

        const raw = localStorage.getItem('fit73-profile');
        if (!raw) return;
        const p = JSON.parse(raw);
        if (p.weight) setWeight(String(p.weight));
        if (p.height) setHeight(String(p.height));
        if (p.age) setAge(String(p.age));
        if (p.gender) setGender(p.gender);
      } catch {
        // ignore
      }
    };

    loadRemoteProfile();
  }, []);

  const calculateBmr = (e) => {
    e.preventDefault();
    const w = Number(weight);
    const h = Number(height);
    const a = Number(age);
    if (!weight || !height || !age || w <= 0 || h <= 0 || a <= 0) return;
    const result = 10 * w + 6.25 * h - 5 * a + (gender === 'male' ? 5 : -161);
    const rounded = Math.round(result);
    setBmr(rounded);
    const stats = { weight: w, height: h, age: a, gender, bmr: rounded };
    localStorage.setItem('fit73-home-stats', JSON.stringify(stats));
    window.dispatchEvent(new CustomEvent('fit73-home-stats-updated', { detail: stats }));
  };

  const profileBmr = (() => {
    const w = Number(weight);
    const h = Number(height);
    const a = Number(age);
    if (!w || !h || !a) return null;
    return Math.round(10 * w + 6.25 * h - 5 * a + (gender === 'male' ? 5 : -161));
  })();

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <form onSubmit={calculateBmr} className="rounded-[20px] border border-brand-white/10 bg-brand-white/6 p-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm text-brand-gray">Weight (kg)
            <input type="number" min="1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 75" className="mt-1 w-full rounded-2xl border border-brand-white/10 bg-brand-black/30 px-3 py-2 outline-none" required />
          </label>
          <label className="text-sm text-brand-gray">Height (cm)
            <input type="number" min="1" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 180" className="mt-1 w-full rounded-2xl border border-brand-white/10 bg-brand-black/30 px-3 py-2 outline-none" required />
          </label>
          <label className="text-sm text-brand-gray">Age
            <input
              type="number"
              min="1"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-brand-white/10 bg-brand-black/30 px-3 py-2 outline-none"
              placeholder="e.g. 25"
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
        <div className="mt-3 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:items-center">
          <button type="submit" className="rounded-full bg-gradient-to-r from-brand-red to-brand-red px-4 py-2 text-sm font-semibold">Calculate</button>
          {bmr ? (
            <div className="text-sm text-brand-gray">
              Estimated BMR: <span className="font-semibold text-brand-white">{bmr} kcal/day</span>
            </div>
          ) : null}
        </div>
      </form>

      <div className="rounded-[24px] border border-brand-red/20 bg-gradient-to-br from-brand-red/10 via-brand-black/80 to-brand-black p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-brand-red">Your Profile</p>
            <p className="mt-2 text-xs text-brand-gray">Daily readiness</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-red/30 bg-brand-red/10 text-brand-red">
            <FaDumbbell className="text-lg" />
          </div>
        </div>

        <div className="space-y-3 text-sm text-brand-gray">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-brand-white/10 bg-brand-white/5 p-3">
              <p className="text-[10px] uppercase tracking-[0.25em] text-brand-gray">Weight</p>
              <p className="mt-2 text-lg font-semibold text-brand-white">{weight || '—'} <span className="text-sm font-normal text-brand-gray">kg</span></p>
            </div>
            <div className="rounded-2xl border border-brand-white/10 bg-brand-white/5 p-3">
              <p className="text-[10px] uppercase tracking-[0.25em] text-brand-gray">Height</p>
              <p className="mt-2 text-lg font-semibold text-brand-white">{height || '—'} <span className="text-sm font-normal text-brand-gray">cm</span></p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-brand-white/10 bg-brand-white/5 p-3">
              <p className="text-[10px] uppercase tracking-[0.25em] text-brand-gray">Age</p>
              <p className="mt-2 text-lg font-semibold text-brand-white">{age || '—'}</p>
            </div>
            <div className="rounded-2xl border border-brand-white/10 bg-brand-white/5 p-3">
              <p className="text-[10px] uppercase tracking-[0.25em] text-brand-gray">Gender</p>
              <p className="mt-2 text-lg font-semibold capitalize text-brand-white">{gender || '—'}</p>
            </div>
          </div>

          {profileBmr ? (
            <div className="rounded-2xl border border-brand-red/30 bg-brand-red/10 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] uppercase tracking-[0.25em] text-brand-red">Current BMR</p>
                <FaHeartbeat className="text-brand-red" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-brand-white">{profileBmr} <span className="text-sm font-medium text-brand-gray">kcal/day</span></p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-brand-white/20 bg-brand-white/5 p-3 text-sm text-brand-gray">
              Add your metrics to unlock your BMR snapshot.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProteinWidget() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [goal, setGoal] = useState('Maintenance');
  const [protein, setProtein] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await getSession();
        const userId = data.session?.user?.id;

        if (userId) {
          const { data: profileData } = await getUserProfile(userId);
          if (profileData) {
            const savedWeight = profileData.weight;
            const savedHeight = profileData.height;
            const savedAge = profileData.age;
            const savedGoal = profileData.goal;

            if (savedWeight) setWeight(String(savedWeight));
            if (savedHeight) setHeight(String(savedHeight));
            if (savedAge) setAge(String(savedAge));
            if (savedGoal) setGoal(savedGoal);
            localStorage.setItem('fit73-profile', JSON.stringify(profileData));
            return;
          }
        }

        const profile = JSON.parse(localStorage.getItem('fit73-profile') || 'null');
        const stats = JSON.parse(localStorage.getItem('fit73-home-stats') || 'null');
        const savedWeight = profile?.weight || stats?.weight;
        const savedHeight = profile?.height || stats?.height;
        const savedAge = profile?.age || stats?.age;

        if (savedWeight) setWeight(String(savedWeight));
        if (savedHeight) setHeight(String(savedHeight));
        if (savedAge) setAge(String(savedAge));
        if (profile?.goal) setGoal(profile.goal);
      } catch {
        // Ignore unavailable saved profile data.
      }
    };

    loadProfile();
  }, []);

  const calculateProtein = (e) => {
    e.preventDefault();
    const weightValue = Number(weight);
    const heightValue = Number(height);
    const ageValue = Number(age);

    if (!weightValue || !heightValue || !ageValue || weightValue <= 0 || heightValue <= 0 || ageValue <= 0) return;

    let goalMultiplier = 1.6;
    if (goal === 'Weight Loss') goalMultiplier = 1.8;
    if (goal === 'Muscle Gain') goalMultiplier = 2.2;
    if (goal === 'Maintenance') goalMultiplier = 1.6;

    const ageFactor = ageValue < 30 ? 1.08 : ageValue > 50 ? 0.97 : 1.02;
    const heightFactor = heightValue > 180 ? 1.05 : heightValue < 160 ? 0.98 : 1.02;

    const target = Math.round(weightValue * goalMultiplier * ageFactor * heightFactor);
    setProtein(target);
  };

  return (
    <div className="rounded-[20px] border border-brand-white/10 bg-brand-black/30 p-4">
      <p className="text-sm uppercase tracking-[0.35em] text-brand-red">Protein Calculator</p>
      <p className="mt-2 text-sm text-brand-gray">Estimate your daily protein target using your age, height, weight, and goal.</p>
      <form onSubmit={calculateProtein} className="mt-5 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm text-brand-gray">Weight (kg)
            <input type="number" min="1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 75" required className="mt-1 w-full rounded-2xl border border-brand-white/10 bg-brand-black/30 px-3 py-2 text-brand-white outline-none focus:border-brand-red/60" />
          </label>
          <label className="block text-sm text-brand-gray">Height (cm)
            <input type="number" min="1" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 180" required className="mt-1 w-full rounded-2xl border border-brand-white/10 bg-brand-black/30 px-3 py-2 text-brand-white outline-none focus:border-brand-red/60" />
          </label>
          <label className="block text-sm text-brand-gray">Age
            <input type="number" min="1" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 25" required className="mt-1 w-full rounded-2xl border border-brand-white/10 bg-brand-black/30 px-3 py-2 text-brand-white outline-none focus:border-brand-red/60" />
          </label>
          <label className="block text-sm text-brand-gray">Goal
            <select value={goal} onChange={(e) => setGoal(e.target.value)} style={{ colorScheme: 'dark' }} className="mt-1 w-full rounded-2xl border border-brand-white/10 bg-brand-black/30 px-3 py-2 text-brand-white outline-none focus:border-brand-red/60">
              <option className="bg-black text-white">Weight Loss</option>
              <option className="bg-black text-white">Muscle Gain</option>
              <option className="bg-black text-white">Maintenance</option>
            </select>
          </label>
        </div>
        <button type="submit" className="w-full rounded-full bg-brand-red px-4 py-2 text-sm font-semibold transition hover:bg-red-700">Calculate Protein</button>
      </form>
      {protein ? (
        <div className="mt-4 rounded-2xl border border-brand-red/30 bg-brand-red/10 p-3">
          <p className="text-xs uppercase tracking-[0.25em] text-brand-red">Daily target</p>
          <p className="mt-1 text-2xl font-semibold text-brand-white">{protein}g protein</p>
        </div>
      ) : null}
    </div>
  );
}

export default function Home() {
  const [homeStats, setHomeStats] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('fit73-home-stats');
      if (raw) setHomeStats(JSON.parse(raw));
    } catch {
      setHomeStats(null);
    }

    const handleStatsUpdate = (event) => setHomeStats(event.detail);
    window.addEventListener('fit73-home-stats-updated', handleStatsUpdate);
    return () => window.removeEventListener('fit73-home-stats-updated', handleStatsUpdate);
  }, []);

  const dietPlans = getPersonalizedDietPlans(homeStats).map((plan) => ({
    ...plan,
    image: dietPlanImages[plan.title],
  }));

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-brand-black text-brand-white">
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="fixed bottom-8 right-[10px] z-50 flex h-10 w-10 items-center justify-center rounded-full border border-brand-red/30 bg-brand-black/80 text-lg text-brand-red shadow-[0_8px_22px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-brand-red hover:bg-brand-red hover:text-brand-white"
      >
        ↑
      </button>

      <HeroSection />

      <motion.section
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Home Stats" title="Calculate your daily energy need" description="Enter your weight, height, age, and gender to estimate your BMR instantly." />
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <BmrWidget />
            <ProteinWidget />
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.05 }}
        className="px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Signature Plans" title="Elite nutrition programs" description="Curated for fat loss, muscle gain, and maintenance with fit73 premium structure." />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {dietPlans.map((plan) => (
              <motion.article
                key={plan.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="overflow-hidden rounded-[28px] border border-brand-white/10 bg-brand-white/8 backdrop-blur-xl"
              >
                <img src={plan.image} alt={plan.title} className="h-48 w-full rounded-xl border border-brand-white/10 object-cover" />
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{plan.title}</h3>
                    <FaAppleAlt className="text-brand-red" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm text-brand-gray">
                    <div className="rounded-2xl bg-brand-white/10 p-3"><p className="text-brand-gray">Calories</p><p className="font-semibold text-brand-white">{plan.calories}</p></div>
                    <div className="rounded-2xl bg-brand-white/10 p-3"><p className="text-brand-gray">Protein</p><p className="font-semibold text-brand-white">{plan.protein}</p></div>
                    <div className="rounded-2xl bg-brand-white/10 p-3"><p className="text-brand-gray">Carbs</p><p className="font-semibold text-brand-white">{plan.carbs}</p></div>
                    <div className="rounded-2xl bg-brand-white/10 p-3"><p className="text-brand-gray">Fat</p><p className="font-semibold text-brand-white">{plan.fat}</p></div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-brand-gray">
                    <span>{plan.meals} meals/day</span>
                    <Link to={`/diet-plan/${encodeURIComponent(plan.title)}`} className="rounded-full border border-brand-red/30 bg-brand-red/10 px-3 py-1 text-brand-red transition hover:bg-brand-red hover:text-brand-white">Enter</Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.06 }}
        className="px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Training Library" title="Home workouts that fit your schedule" description="High-impact sessions with smart progression and recovery guidance." />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {workouts.map((workout) => (
              <motion.article
                key={workout.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="overflow-hidden rounded-[28px] border border-brand-white/10 bg-brand-white/8 p-4 backdrop-blur-xl"
              >
                <img src={workout.image} alt={workout.title} className="h-56 w-full rounded-xl border border-brand-white/10 bg-brand-black object-contain" />
                <div className="mt-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{workout.title}</h3>
                    <p className="mt-2 text-sm text-brand-gray">{workout.sets} sets • {workout.reps} reps • {workout.rest} rest</p>
                  </div>
                  <Link to={`/workout/${encodeURIComponent(workout.title)}`} className="rounded-full border border-brand-red/30 bg-brand-red/10 px-3 py-1 text-sm text-brand-red transition hover:bg-brand-red hover:text-brand-white">Enter</Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      
    </div>
  );
}
