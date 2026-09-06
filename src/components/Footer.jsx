import { FaGithub, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="border-t border-brand-white/10 bg-brand-black/70 px-4 py-10 text-sm text-brand-gray sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4">
          <p className="font-semibold tracking-[0.35em] text-brand-red">FIT73</p>
          <div className="flex flex-wrap gap-4">
            <a href="/about" className="transition hover:text-brand-red">About</a>
            <a href="/contact" className="transition hover:text-brand-red">Contact</a>
            <a href="/ai" className="transition hover:text-brand-red">AI Coach</a>
          </div>
        </div>
        <div className="flex flex-col items-end gap-4">
          <div className="flex gap-3">
            <a href="https://www.instagram.com/rowdysai_2112?stkn=MXViazVqeGYwYmttaQ%3D%3D" target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition hover:bg-brand-red hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-red/60"><FaInstagram /></a>
            <a href="https://github.com/sai-O73" target="_blank" rel="noreferrer" aria-label="GitHub" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition hover:bg-brand-red hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-red/60"><FaGithub /></a>
            <a href="https://www.linkedin.com/in/d-rama-venkata-sai-192131418?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition hover:bg-brand-red hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-red/60"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
