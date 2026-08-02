import SectionHeading from '../components/SectionHeading';

const plans = [
  { title: 'Weight Loss', calories: '1800', protein: '120g', carbs: '180g', fat: '55g', meals: '4', icon: '🔥' },
  { title: 'Muscle Gain', calories: '2600', protein: '180g', carbs: '320g', fat: '70g', meals: '5', icon: '💪' },
  { title: 'Maintenance', calories: '2200', protein: '145g', carbs: '250g', fat: '60g', meals: '4', icon: '⚖️' },
];

export default function Diet() {
  return (
    <div className="min-h-screen bg-brand-black px-4 py-16 text-brand-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Diet Plans" title="Nutrition strategies that feel effortless" description="Structured meals with precision macro targets and smart food pairing." />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <div key={plan.title} className="rounded-[28px] border border-brand-white/10 bg-brand-white/8 p-6 backdrop-blur-xl">
              <div className="text-4xl">{plan.icon}</div>
              <h3 className="mt-4 text-xl font-semibold">{plan.title}</h3>
              <div className="mt-4 space-y-3 text-sm text-brand-gray">
                <div className="flex items-center justify-between rounded-2xl bg-brand-white/10 px-3 py-2"><span>Calories</span><span className="font-semibold text-brand-white">{plan.calories}</span></div>
                <div className="flex items-center justify-between rounded-2xl bg-brand-white/10 px-3 py-2"><span>Protein</span><span className="font-semibold text-brand-white">{plan.protein}</span></div>
                <div className="flex items-center justify-between rounded-2xl bg-brand-white/10 px-3 py-2"><span>Carbs</span><span className="font-semibold text-brand-white">{plan.carbs}</span></div>
                <div className="flex items-center justify-between rounded-2xl bg-brand-white/10 px-3 py-2"><span>Fat</span><span className="font-semibold text-brand-white">{plan.fat}</span></div>
              </div>
              <p className="mt-5 text-sm text-brand-gray">{plan.meals} meals per day • Adapted for sustainable progress.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
