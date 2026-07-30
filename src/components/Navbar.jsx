import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { getSession, signOut, subscribeToAuth } from '../services/supabase';
import { toast } from 'react-hot-toast';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Diet Plans', to: '/diet' },
  { label: 'Protein', to: '/protein' },
  { label: 'BMI', to: '/bmi' },
  { label: 'AI Coach', to: '/ai' },
  { label: 'Contact', to: '/contact' },
  { label: 'Profile', to: '/profile' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      const { data } = await getSession();
      if (active) setSession(data.session);
    };

    loadSession();

    const { data: { subscription } } = subscribeToAuth((_event, currentSession) => {
      if (active) setSession(currentSession);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    setSession(null);
    navigate('/');
  };

  const handleProtectedClick = (event, to) => {
    if (!session && to !== '/') {
      event.preventDefault();
      toast.error('Please login first!');
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-600 shadow-[0_0_30px_rgba(96,165,250,0.35)]">
            <span className="text-xl font-semibold">AG</span>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.35em] text-cyan-300">AI GYM</p>
            <p className="text-xs text-slate-400">Performance Lab</p>
          </div>
        </Link>

        <button className="rounded-full border border-cyan-400/30 p-2 text-cyan-300 lg:hidden" onClick={() => setOpen(!open)}>
          {open ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link key={link.to} to={link.to} onClick={(event) => handleProtectedClick(event, link.to)} className="text-sm text-slate-300 transition hover:text-cyan-300">
              {link.label}
            </Link>
          ))}
          {session ? (
            <button onClick={handleLogout} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-300">
              <FiLogOut /> Logout
            </button>
          ) : null}
        </nav>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-black/90 px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link key={link.to} to={link.to} onClick={(event) => {
                setOpen(false);
                handleProtectedClick(event, link.to);
              }} className="text-sm text-slate-300">
                {link.label}
              </Link>
            ))}
            {session ? (
              <button onClick={handleLogout} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200">
                <FiLogOut /> Logout
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </motion.header>
  );
}
