import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft, FaDumbbell } from 'react-icons/fa';

const workouts = {
  Chest: { sets: '4', reps: '10-12', rest: '60s', difficulty: 'Intermediate', focus: 'Build pressing strength and controlled chest volume.', image: 'https://i.pinimg.com/736x/ab/66/73/ab66730e17864c56a6f932c86de053d4.jpg' },
  Back: { sets: '4', reps: '8-10', rest: '75s', difficulty: 'Advanced', focus: 'Develop back strength with steady pulling mechanics.', image: 'https://i.pinimg.com/736x/cc/0a/da/cc0ada81bd8f5f91bc6133a35436563d.jpg' },
  Legs: { sets: '5', reps: '8-12', rest: '90s', difficulty: 'Advanced', focus: 'Train lower-body power with strong, repeatable technique.', image: 'https://i.pinimg.com/736x/c1/c4/86/c1c486b9f4bbc17755131504ea00a04d.jpg' },
};

export default function WorkoutPlan() {
  const { workoutName } = useParams();
  const title = decodeURIComponent(workoutName || 'Chest');
  const workout = workouts[title] || workouts.Chest;

  return (
    <div className="min-h-screen bg-brand-black px-4 py-16 text-brand-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/home" className="inline-flex items-center gap-2 text-sm text-brand-gray transition hover:text-brand-red">
          <FaArrowLeft /> Back to home
        </Link>
        <article className="mt-8 rounded-[32px] border border-brand-red/30 bg-brand-white/8 p-6 backdrop-blur-xl sm:p-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-red">Training session</p>
              <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{title}</h1>
            </div>
            <FaDumbbell className="mt-2 text-3xl text-brand-red" />
          </div>
          <p className="mt-6 text-lg leading-8 text-brand-gray">{workout.focus}</p>
          {workout.image ? <img src={workout.image} alt={`${title} workout`} className="mt-6 h-auto w-full rounded-xl border border-brand-white/10 bg-brand-black object-contain" /> : null}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              ['Sets', workout.sets],
              ['Reps', workout.reps],
              ['Rest', workout.rest],
              ['Difficulty', workout.difficulty],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-brand-white/10 bg-brand-black/30 p-4">
                <p className="text-sm text-brand-gray">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-brand-white">{value}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}