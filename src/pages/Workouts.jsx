import SectionHeading from '../components/SectionHeading';

const workouts = [
  { title: 'Chest', muscle: 'Pectorals', sets: '4', reps: '10-12', rest: '60s', level: 'Intermediate', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80' },
  { title: 'Back', muscle: 'Latissimus', sets: '4', reps: '8-10', rest: '75s', level: 'Advanced', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80' },
  { title: 'Legs', muscle: 'Quads & Glutes', sets: '5', reps: '8-12', rest: '90s', level: 'Advanced', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80' },
  { title: 'Abs', muscle: 'Core', sets: '3', reps: '15-20', rest: '45s', level: 'Beginner', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80' },
];

export default function Workouts() {
  return (
    <div className="min-h-screen bg-black px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Workout Plans" title="Strength sessions built for real progress" description="Focused routines with reps, rest, and bold execution cues." />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {workouts.map((item) => (
            <div key={item.title} className="overflow-hidden rounded-[28px] border border-white/10 bg-white/8 backdrop-blur-xl">
              <img src={item.image} alt={item.title} className="h-44 w-full object-cover" />
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-300">{item.level}</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{item.muscle}</p>
                <div className="mt-4 space-y-2 text-sm text-slate-300">
                  <div className="flex items-center justify-between rounded-2xl bg-white/10 px-3 py-2"><span>Sets</span><span>{item.sets}</span></div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/10 px-3 py-2"><span>Reps</span><span>{item.reps}</span></div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/10 px-3 py-2"><span>Rest</span><span>{item.rest}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
