export default function Footer() {
  return (
    <footer className="border-t border-brand-white/10 bg-brand-black/70 px-4 py-10 text-sm text-brand-gray sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-semibold tracking-[0.35em] text-brand-red">FIT73</p>
          <p>Premium fitness intelligence for stronger, smarter training.</p>
        </div>
        <div className="flex gap-4">
          <a href="/about" className="transition hover:text-brand-red">About</a>
          <a href="/contact" className="transition hover:text-brand-red">Contact</a>
          <a href="/ai" className="transition hover:text-brand-red">AI Coach</a>
        </div>
      </div>
    </footer>
  );
}
