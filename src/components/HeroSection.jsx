import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(var(--accent-rgb),0.22),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(var(--muted-rgb),0.18),_transparent_30%)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div initial={{ x: -24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
          <p className="mb-4 inline-flex rounded-full border border-brand-red/30 bg-brand-red/10 px-4 py-2 text-sm font-medium text-brand-red">
            AI-powered fitness intelligence
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-brand-white sm:text-5xl lg:text-7xl">
            Transform your body with FIT73 <span className="bg-gradient-to-r from-brand-red to-brand-red bg-clip-text text-transparent">AI precision</span>
          </h1>
        </motion.div>

        <motion.div initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="relative">
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-brand-red/20 via-transparent to-brand-red/20 blur-3xl" />
          <img
            src="https://i.pinimg.com/736x/19/c7/94/19c794e6ab55ee9cde857a9c48577ec0.jpg"
            alt="Strength training"
            className="relative h-[450px] w-full rounded-[32px] border border-brand-white/10 object-cover shadow-[0_20px_80px_rgba(0,0,0,0.4)]"
          />
        </motion.div>
      </div>
    </section>
  );
}
