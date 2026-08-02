import HeroSection from '../components/HeroSection';
import SectionHeading from '../components/SectionHeading';
import { motion } from 'framer-motion';
import { FaDumbbell, FaAppleAlt, FaHeartbeat, FaRunning } from 'react-icons/fa';
import { useEffect, useState } from 'react';

const dietPlans = [
  { title: 'Weight Loss', calories: '1800', protein: '120g', carbs: '180g', fat: '55g', meals: '4', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80' },
  { title: 'Muscle Gain', calories: '2600', protein: '180g', carbs: '320g', fat: '70g', meals: '5', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80' },
  { title: 'Maintenance', calories: '2200', protein: '145g', carbs: '250g', fat: '60g', meals: '4', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80' },
];

const workouts = [
  { title: 'Chest', sets: '4', reps: '10-12', rest: '60s', difficulty: 'Intermediate', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80' },
  { title: 'Back', sets: '4', reps: '8-10', rest: '75s', difficulty: 'Advanced', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80' },
  { title: 'Legs', sets: '5', reps: '8-12', rest: '90s', difficulty: 'Advanced', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80' },
];

function BmrWidget() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('18');
  const [gender, setGender] = useState('male');
  const [bmr, setBmr] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('fit73-profile');
      if (!raw) return;
      const p = JSON.parse(raw);
      if (p.weight) setWeight(p.weight);
      if (p.height) setHeight(p.height);
      if (p.age) setAge(p.age);
      if (p.gender) setGender(p.gender);
    } catch {
      // ignore
    }
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

      <div className="rounded-[20px] border border-brand-white/10 bg-brand-black/30 p-4">
        <p className="text-sm uppercase tracking-[0.35em] text-brand-red">Your Profile</p>
        <div className="mt-4 space-y-3 text-sm text-brand-gray">
          <div className="rounded-2xl bg-brand-white/10 p-3">
            <p className="text-xs uppercase tracking-[0.25em] text-brand-gray">Body Weight</p>
            <p className="mt-1 text-lg font-semibold text-brand-white">{weight} kg</p>
          </div>
          <div className="rounded-2xl bg-brand-white/10 p-3">
            <p className="text-xs uppercase tracking-[0.25em] text-brand-gray">Height</p>
            <p className="mt-1 text-lg font-semibold text-brand-white">{height} cm</p>
          </div>
          <div className="rounded-2xl bg-brand-white/10 p-3 grid gap-2 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brand-gray">Age</p>
              <p className="mt-1 text-lg font-semibold text-brand-white">{age}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brand-gray">Gender</p>
              <p className="mt-1 text-lg font-semibold text-brand-white">{gender}</p>
            </div>
          </div>
          {profileBmr ? (
            <div className="rounded-2xl border border-brand-red/30 bg-brand-red/10 p-3">
              <p className="text-xs uppercase tracking-[0.25em] text-brand-red">Current BMR</p>
              <p className="mt-1 text-xl font-semibold text-brand-white">{profileBmr} kcal/day</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-black text-brand-white">
      <HeroSection />

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Home Stats" title="Calculate your daily energy need" description="Enter your weight, height, age, and gender to estimate your BMR instantly." />
          <BmrWidget />
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Signature Plans" title="Elite nutrition programs" description="Curated for fat loss, muscle gain, and maintenance with premium structure." />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {dietPlans.map((plan, index) => (
              <motion.article initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.08 }} key={plan.title} className="overflow-hidden rounded-[28px] border border-brand-white/10 bg-brand-white/8 backdrop-blur-xl">
                <img src={plan.image} alt={plan.title} className="h-48 w-full object-cover" />
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
                    <span className="rounded-full border border-brand-red/30 bg-brand-red/10 px-3 py-1 text-brand-red">Premium</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Training Library" title="Home workouts that fit your schedule" description="High-impact sessions with smart progression and recovery guidance." />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {workouts.map((workout, index) => (
              <motion.article initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.08 }} key={workout.title} className="overflow-hidden rounded-[28px] border border-brand-white/10 bg-brand-white/8 p-4 backdrop-blur-xl">
                <img src={workout.image} alt={workout.title} className="h-44 w-full rounded-[22px] object-cover" />
                <div className="mt-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{workout.title}</h3>
                    <p className="mt-2 text-sm text-brand-gray">{workout.sets} sets • {workout.reps} reps • {workout.rest} rest</p>
                  </div>
                  <span className="rounded-full border border-brand-red/30 bg-brand-red/10 px-3 py-1 text-sm text-brand-red">{workout.difficulty}</span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      
    </div>
  );
}
