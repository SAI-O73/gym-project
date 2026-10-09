import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(var(--accent-rgb),0.22),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(var(--muted-rgb),0.18),_transparent_30%)]" />

      <motion.div
        initial={{ x: '-105%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.08 }}
        className="absolute inset-y-0 left-0 z-30 w-full bg-brand-black/95"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ x: -24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.18 }}
          className="relative z-10"
        >
          <h1 className="text-4xl font-semibold leading-[0.95] text-brand-white sm:text-5xl lg:text-7xl">
            Transform Your Physique with RUDRAFIT
          </h1>
        </motion.div>

        <motion.div
          initial={{ x: 24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.24 }}
          className="relative z-10"
        >
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-brand-red/20 via-transparent to-brand-red/20 blur-3xl" />
          <img
            src="https://i.pinimg.com/736x/19/c7/94/19c794e6ab55ee9cde857a9c48577ec0.jpg"
            alt="Strength training"
            className="relative mx-auto block h-[280px] max-w-full overflow-hidden rounded-[20px] border border-brand-white/10 bg-brand-black object-contain object-center p-2 shadow-[0_20px_80px_rgba(0,0,0,0.4)] sm:h-[360px] sm:rounded-[28px] sm:p-3 lg:h-[450px] lg:rounded-[32px]"
          />
        </motion.div>
      </div>
    </section>
  );
}
