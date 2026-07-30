import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiCheckCircle } from 'react-icons/fi';
import { signInWithEmail, signUpWithEmail, supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/dashboard');
      }
    };

    checkSession();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (mode === 'register' && form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'register') {
        const { data, error } = await signUpWithEmail({ email: form.email, password: form.password });
        if (error) throw error;
        toast.success('Account created. Please verify your email before logging in.');
        setMode('login');
      } else {
        const { data, error } = await signInWithEmail({ email: form.email, password: form.password });
        if (error) throw error;
        if (data?.session?.user?.email_confirmed_at) {
          toast.success('Welcome back to AI Gym');
          navigate('/dashboard');
        } else {
          toast.error('Please verify your email before logging in.');
        }
      }
    } catch (error) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(192,132,252,0.18),_transparent_35%),#000] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-8 lg:flex-row">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl text-center lg:text-left">
          <h1 className="text-4xl font-semibold sm:text-5xl lg:text-6xl">Welcome to your AI-powered training studio.</h1>
          <p className="mt-5 text-lg text-slate-300">Join elite programs, a digital coach, and progress tracking crafted for your goals.</p>
        </motion.div>

        <motion.form initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/10 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-cyan-300">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</p>
              <h2 className="text-2xl font-semibold">{mode === 'login' ? 'Sign in to continue' : 'Join the performance lab'}</h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-fuchsia-600">
              <FiCheckCircle size={20} />
            </div>
          </div>

          {mode === 'register' ? (
            <div className="mb-4 space-y-4">
              <label className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 transition focus-within:border-cyan-400/60">
                <FiUser className="text-cyan-300" />
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-transparent outline-none" placeholder="Name" />
              </label>
            </div>
          ) : null}

          <div className="space-y-4">
            <label className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 transition focus-within:border-cyan-400/60">
              <FiMail className="text-cyan-300" />
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-transparent outline-none" placeholder="Email" />
            </label>
            <label className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 transition focus-within:border-cyan-400/60">
              <FiLock className="text-cyan-300" />
              <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full bg-transparent outline-none" placeholder="Password" />
            </label>
            {mode === 'register' ? (
              <label className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 transition focus-within:border-cyan-400/60">
                <FiLock className="text-cyan-300" />
                <input required type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="w-full bg-transparent outline-none" placeholder="Confirm Password" />
              </label>
            ) : null}
          </div>

          <button type="submit" className="mt-6 w-full rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-3 font-semibold text-white shadow-[0_0_30px_rgba(34,211,238,0.2)] transition hover:scale-[1.01]">
            {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Register'}
          </button>

          <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
            <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="hover:text-cyan-300">
              {mode === 'login' ? 'Create Account' : 'Already have an account?'}
            </button>
            <button type="button" className="hover:text-cyan-300">Forgot Password</button>
          </div>

          <div className="mt-6 flex items-center gap-3 text-sm text-slate-400">
            <div className="h-px flex-1 bg-white/10" />
            <span>Or continue with</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="mt-4 flex justify-center gap-3">
            {['G', 'f', 'in'].map((item) => (
              <div key={item} className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </motion.form>
      </div>
    </div>
  );
}
