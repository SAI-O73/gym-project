import { motion } from 'framer-motion';
import { FaAppleAlt, FaArrowLeft } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';

const plans = {
  'Weight Loss': {
    calories: '1800',
    protein: '120g',
    carbs: '180g',
    fat: '55g',
    meals: '4',
    focus: 'A balanced calorie deficit designed for steady, sustainable fat loss.',
  },
  'Muscle Gain': {
    calories: '2600',
    protein: '180g',
    carbs: '320g',
    fat: '70g',
    meals: '5',
    focus: 'A high-protein structure to support training performance and muscle growth.',
  },
  Maintenance: {
    calories: '2200',
    protein: '145g',
    carbs: '250g',
    fat: '60g',
    meals: '4',
    focus: 'A flexible macro balance for maintaining energy, strength, and body composition.',
  },
};

const weightLossMeals = [
  ['8:00 AM', 'Breakfast', 'Whole Eggs', '2', '12g'],
  ['', '', 'Egg Whites', '4', '14g'],
  ['', '', 'Oats', '60g', '8g'],
  ['', '', 'Banana', '1', '1g'],
  ['1:00 PM', 'Lunch', 'Chicken Breast', '150g', '45g'],
  ['', '', 'Cooked Rice', '150g', '4g'],
  ['', '', 'Mixed Vegetables', '200g', '4g'],
  ['4:30 PM', 'Pre-Workout', 'Banana', '1', '1g'],
  ['', '', 'Black Coffee', '1 Cup', '0g'],
  ['7:00 PM', 'Post-Workout', 'Whey Protein', '1 Scoop', '24g'],
  ['8:30 PM', 'Dinner', 'Chicken/Fish', '150g', '40g'],
  ['', '', 'Chapati', '2', '6g'],
  ['', '', 'Mixed Vegetables', '200g', '4g'],
];

const muscleGainMeals = [
  ['7:30 AM', 'Breakfast', 'Whole Eggs', '4'],
  ['', '', 'Oats', '80g'],
  ['', '', 'Banana', '2'],
  ['10:30 AM', 'Snack', 'Milk', '500ml'],
  ['', '', 'Peanuts', '30g'],
  ['1:30 PM', 'Lunch', 'Chicken Breast', '200g'],
  ['', '', 'Cooked Rice', '250g'],
  ['', '', 'Mixed Vegetables', '200g'],
  ['4:30 PM', 'Pre-Workout', 'Banana', '2'],
  ['', '', 'Black Coffee', '1 Cup'],
  ['7:00 PM', 'Post-Workout', 'Whey Protein', '1 Scoop'],
  ['8:30 PM', 'Dinner', 'Chicken/Fish/Paneer', '200g'],
  ['', '', 'Chapati', '3'],
  ['', '', 'Mixed Vegetables', '200g'],
  ['10:30 PM', 'Before Bed', 'Milk', '300ml'],
];

const maintenanceMeals = [
  ['7:30 AM', 'Breakfast', 'Whole Eggs', '3'],
  ['', '', 'Oats', '60g'],
  ['', '', 'Banana', '1'],
  ['10:30 AM', 'Snack', 'Milk', '300ml'],
  ['', '', 'Peanuts', '20g'],
  ['1:30 PM', 'Lunch', 'Chicken Breast/Fish', '150g'],
  ['', '', 'Cooked Rice', '200g'],
  ['', '', 'Mixed Vegetables', '200g'],
  ['4:30 PM', 'Pre-Workout', 'Banana', '1'],
  ['', '', 'Black Coffee', '1 Cup'],
  ['7:00 PM', 'Post-Workout', 'Whey Protein', '1 Scoop'],
  ['8:30 PM', 'Dinner', 'Chicken/Fish/Paneer', '150g'],
  ['', '', 'Chapati', '2'],
  ['', '', 'Mixed Vegetables', '200g'],
  ['10:30 PM', 'Before Bed', 'Milk', '250ml'],
];

const listedProtein = weightLossMeals.reduce((total, [, , , , protein]) => total + Number.parseInt(protein, 10), 0);

export default function DietPlan() {
  const { planName } = useParams();
  const planTitle = decodeURIComponent(planName || 'Weight Loss');
  const plan = plans[planTitle] || plans['Weight Loss'];
  const isWeightLoss = planTitle === 'Weight Loss';
  const isMuscleGain = planTitle === 'Muscle Gain';
  const isMaintenance = planTitle === 'Maintenance';
  const mealRows = isWeightLoss ? weightLossMeals : isMuscleGain ? muscleGainMeals : maintenanceMeals;

  return (
    <div className="min-h-screen bg-brand-black px-4 py-16 text-brand-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/home" className="inline-flex items-center gap-2 text-sm text-brand-gray transition hover:text-brand-red">
          <FaArrowLeft /> Back to home
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="relative mt-8 overflow-hidden rounded-[32px] border border-brand-red/30 bg-brand-white/8 p-6 shadow-[0_24px_80px_rgba(var(--accent-rgb),0.16)] backdrop-blur-xl sm:p-10"
        >
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-red/15 blur-2xl" />
          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-red">Signature Plan</p>
                <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{planTitle}</h1>
              </div>
              <FaAppleAlt className="mt-2 text-3xl text-brand-red" />
            </div>

            <p className="mt-6 max-w-xl text-lg leading-8 text-brand-gray">{plan.focus}</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                ['Daily calories', `${plan.calories} kcal`],
                ['Protein', plan.protein],
                ['Carbohydrates', plan.carbs],
                ['Healthy fats', plan.fat],
              ].map(([label, value], index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -16 : 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.08, duration: 0.35 }}
                  className="rounded-2xl border border-brand-white/10 bg-brand-black/30 p-4"
                >
                  <p className="text-sm text-brand-gray">{label}</p>
                  <p className="mt-2 text-2xl font-semibold text-brand-white">{value}</p>
                </motion.div>
              ))}
            </div>

            {isWeightLoss || isMuscleGain || isMaintenance ? (
              <div className="mt-8 overflow-hidden rounded-[24px] border border-brand-white/10 bg-brand-black/20">
                <div className="flex flex-col gap-3 border-b border-brand-white/10 bg-brand-white/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-red">Nutrition schedule</p>
                    <h2 className="mt-1 text-lg font-semibold">Daily meal plan</h2>
                  </div>
                  {isWeightLoss ? (
                    <div className="rounded-xl border border-brand-red/20 bg-brand-red/10 px-3 py-2 text-sm">
                      <span className="text-brand-gray">Listed protein </span>
                      <span className="font-semibold text-brand-white">{listedProtein}g</span>
                    </div>
                  ) : null}
                </div>
                <div className="overflow-x-auto">
                  <table className={`w-full text-left text-sm ${isWeightLoss ? 'min-w-[620px]' : 'min-w-[560px]'}`}>
                    <caption className="sr-only">{planTitle} daily meal plan with quantities</caption>
                    <thead className="bg-brand-black/50 text-xs uppercase tracking-[0.14em] text-brand-gray">
                      <tr>
                        <th className="px-4 py-3.5 font-medium">Time</th>
                        <th className="px-4 py-3.5 font-medium">Meal</th>
                        <th className="px-4 py-3.5 font-medium">Food</th>
                        <th className="px-4 py-3.5 font-medium">Quantity</th>
                        {isWeightLoss ? <th className="px-4 py-3.5 font-medium">Protein</th> : null}
                      </tr>
                    </thead>
                    <tbody>
                      {mealRows.map(([time, meal, food, quantity, protein], index) => (
                        <tr key={`${food}-${index}`} className={`border-t border-brand-white/10 ${index % 2 === 0 ? 'bg-brand-white/[0.03]' : ''}`}>
                          <td className="whitespace-nowrap px-4 py-3.5 font-medium text-brand-red">{time || '\u00a0'}</td>
                          <td className="px-4 py-3.5 text-brand-gray">{meal ? <span className="rounded-full bg-brand-white/10 px-2.5 py-1 text-xs">{meal}</span> : '\u00a0'}</td>
                          <td className="px-4 py-3.5 font-medium text-brand-white">{food}</td>
                          <td className="px-4 py-3.5 text-brand-gray">{quantity}</td>
                          {isWeightLoss ? <td className="px-4 py-3.5 font-semibold text-brand-red">{protein}</td> : null}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            <div className="mt-8 flex items-center justify-between border-t border-brand-white/10 pt-6 text-sm text-brand-gray">
              <span>{plan.meals} meals per day</span>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
