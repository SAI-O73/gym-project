import HeroSection from '../components/HeroSection';
import SectionHeading from '../components/SectionHeading';
import { motion } from 'framer-motion';
import { FaDumbbell, FaAppleAlt, FaHeartbeat, FaRunning } from 'react-icons/fa';

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

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-black text-brand-white">
      <HeroSection />

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

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[32px] border border-brand-white/10 bg-gradient-to-br from-brand-red/10 via-brand-white/5 to-brand-red/10 p-8 backdrop-blur-xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-red">Performance Metrics</p>
              <h2 className="mt-3 text-3xl font-semibold text-brand-white sm:text-4xl">Track your recovery, body composition, and progress in one place.</h2>
              <p className="mt-4 text-brand-gray">From BMI and protein targets to daily check-ins, FIT73 gives you actionable insights.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Calories', value: '2,240', icon: <FaDumbbell /> },
                { label: 'Protein', value: '145g', icon: <FaAppleAlt /> },
                { label: 'Recovery', value: '98%', icon: <FaHeartbeat /> },
              ].map((item) => (
                <div key={item.label} className="rounded-[24px] border border-brand-white/10 bg-brand-black/30 p-5 text-center">
                  <div className="mb-3 flex justify-center text-brand-red">{item.icon}</div>
                  <p className="text-2xl font-semibold text-brand-white">{item.value}</p>
                  <p className="mt-2 text-sm text-brand-gray">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
