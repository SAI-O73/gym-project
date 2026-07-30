import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.22),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(192,132,252,0.18),_transparent_30%)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div initial={{ x: -24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
          <p className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
            AI-powered fitness intelligence
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-7xl">
            Transform your body with <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-500 bg-clip-text text-transparent">AI precision</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
            Personalized diets, adaptive workout plans, and a coach that evolves with your progress.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/dashboard" className="rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-6 py-3 font-semibold text-white shadow-[0_0_30px_rgba(34,211,238,0.25)] transition hover:scale-[1.02]">
              Get Started
            </Link>
            <Link to="/diet" className="rounded-full border border-white/10 bg-white/10 px-6 py-3 font-semibold text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-300">
              Explore Plans
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-3 text-sm text-slate-400">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Personalized Diet</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">AI Coach</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Protein Calculator</span>
          </div>
        </motion.div>

        <motion.div initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="relative">
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-cyan-500/20 via-transparent to-fuchsia-500/20 blur-3xl" />
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80"
            alt="Strength training"
            className="relative h-[450px] w-full rounded-[32px] border border-white/10 object-cover shadow-[0_20px_80px_rgba(0,0,0,0.4)]"
          />
        </motion.div>
      </div>
    </section>
  );
}
