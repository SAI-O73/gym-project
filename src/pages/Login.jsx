import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiCheckCircle, FiSave } from 'react-icons/fi';
import { getSession, signInWithEmail, signUpWithEmail, sendPasswordReset } from '../services/supabase';
import { toast } from 'react-hot-toast';

const STORAGE_KEY = 'rudrafit-saved-credentials';

function DumbbellIcon({ lifted = false }) {
  return (
    <svg viewBox="0 0 700 260" className="h-28 w-60 drop-shadow-[0_0_16px_rgba(255,255,255,0.15)]" aria-label="Dumbbell icon" role="img">
      <g transform={`translate(0 ${lifted ? -14 : 0}) rotate(${lifted ? -9 : 0} 350 130)`}>
        <rect x="78" y="90" width="126" height="80" rx="22" fill="#070707" />
        <rect x="496" y="90" width="126" height="80" rx="22" fill="#070707" />
        <rect x="160" y="104" width="380" height="52" rx="18" fill="#070707" />
        <circle cx="92" cy="130" r="24" fill="#070707" />
        <circle cx="608" cy="130" r="24" fill="#070707" />
        <circle cx="92" cy="130" r="9" fill="#f5f5f5" />
        <circle cx="608" cy="130" r="9" fill="#f5f5f5" />
        <rect x="184" y="112" width="332" height="36" rx="12" fill="#f5f5f5" />
      </g>
    </svg>
  );
}

function getSavedCredentials() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveCredentials(email, password) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ email, password }));
}

function clearSavedCredentials() {
  localStorage.removeItem(STORAGE_KEY);
}

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [isLifted, setIsLifted] = useState(false);
  const dragStartY = useRef(0);
  const isDragging = useRef(false);

  const handleLiftStart = (event) => {
    dragStartY.current = event.clientY;
    isDragging.current = true;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handleLiftMove = (event) => {
    if (!isDragging.current) return;
    const deltaY = event.clientY - dragStartY.current;

    if (deltaY < -55) {
      setIsLifted(true);
      isDragging.current = false;
    }
  };

  const handleLiftEnd = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const saved = getSavedCredentials();
    if (saved?.email) {
      setForm((prev) => ({ ...prev, email: saved.email, password: saved.password || '' }));
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await getSession();
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
        const redirectTo = import.meta.env.VITE_AUTH_REDIRECT || `${window.location.origin}/auth/confirmed`;
        const { data, error } = await signUpWithEmail({ email: form.email, password: form.password, redirectTo });
        if (error) throw error;
        if (rememberMe) {
          saveCredentials(form.email, form.password);
        } else {
          clearSavedCredentials();
        }
        toast.success('Account created. Please verify your email before logging in.');
        setMode('login');
      } else {
        const { data, error } = await signInWithEmail({ email: form.email, password: form.password });
        if (error) throw error;
        if (rememberMe) {
          saveCredentials(form.email, form.password);
        } else {
          clearSavedCredentials();
        }
        if (data?.session?.user?.email_confirmed_at) {
          toast.success('Welcome back to RUDRAFIT');
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

  const handleReset = async () => {
    if (!form.email) {
      toast('Please enter your account email above to receive a reset link.');
      return;
    }
    try {
      setLoading(true);
      setResetMessage('');
      const envRedirect = import.meta.env.VITE_RESET_REDIRECT;
      const redirectTo = envRedirect && envRedirect.length > 0 ? envRedirect : window.location.origin + '/reset-password';
      const { data, error } = await sendPasswordReset(form.email, redirectTo);
      if (error) throw error;
      setResetMessage('Check your email to reset your password.');
      toast.success('Password reset email sent.');
      console.log('Password reset data:', data);
    } catch (error) {
      const message = error?.message || 'Failed to send reset email';
      setResetMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={"min-h-screen bg-[radial-gradient(circle_at_top,_rgba(var(--accent-rgb),0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(var(--muted-rgb),0.12),_transparent_35%),var(--bg)] px-4 py-10 text-brand-white sm:px-6 lg:px-8"}>
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-8 lg:flex-row">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl text-center lg:text-left">
          <h1 className="text-4xl font-semibold sm:text-5xl lg:text-6xl float">Welcome to your AI-powered training studio.</h1>
        </motion.div>

        <div className="relative w-full max-w-md">
          <motion.div
            initial={{ opacity: 0.95, y: 8 }}
            animate={{ opacity: isLifted ? 0 : 1, y: isLifted ? -20 : 8, pointerEvents: isLifted ? 'none' : 'auto' }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            onPointerDown={handleLiftStart}
            onPointerMove={handleLiftMove}
            onPointerUp={handleLiftEnd}
            onPointerCancel={handleLiftEnd}
            onClick={() => setIsLifted(true)}
            className="mb-4 mt-6 flex w-full cursor-grab select-none flex-col items-center justify-center touch-none active:cursor-grabbing"
          >
            <div className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.4em] text-brand-red/80">
              Drag up
            </div>
            <motion.div
              animate={{ y: isLifted ? -18 : 0, rotate: isLifted ? -8 : 0, scale: isLifted ? 1.04 : [1, 1.03, 1] }}
              transition={{ duration: 0.45, ease: 'easeOut', scale: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } }}
              className="flex w-full items-center justify-center"
            >
              <DumbbellIcon lifted={isLifted} />
            </motion.div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, scale: 0.88, y: 26 }}
            animate={{ opacity: isLifted ? 1 : 0, scale: isLifted ? 1 : 0.88, y: isLifted ? 0 : 26, pointerEvents: isLifted ? 'auto' : 'none' }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            onSubmit={handleSubmit}
            className="relative w-full rounded-[32px] border border-brand-white/10 bg-brand-white/10 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-8"
          >
          <div className="absolute inset-0 -z-10 rounded-[32px] bg-animated" />
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-brand-red">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</p>
              <h2 className="text-2xl font-semibold">{mode === 'login' ? 'Sign in to continue' : 'Join the performance lab'}</h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-red to-brand-red"><FiCheckCircle size={20} className="float-slow" /></div>
          </div>

          {resetMessage ? <div className="mb-4 rounded-md border border-brand-white/10 bg-brand-black/20 px-4 py-3 text-sm text-brand-gray">{resetMessage}</div> : null}
          {mode === 'register' ? <div className="mb-4 space-y-4"><label className="group flex items-center gap-3 rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 transition focus-within:border-brand-red/60"><FiUser className="text-brand-red" /><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-transparent outline-none" placeholder="Name" /></label></div> : null}
          <div className="space-y-4">
            <label className="group flex items-center gap-3 rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 transition focus-within:border-brand-red/60"><FiMail className="text-brand-red" /><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-transparent outline-none" placeholder="Email" /></label>
            <label className="group flex items-center gap-3 rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 transition focus-within:border-brand-red/60"><FiLock className="text-brand-red" /><input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full bg-transparent outline-none" placeholder="Password" /></label>
            {mode === 'register' ? <label className="group flex items-center gap-3 rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 transition focus-within:border-brand-red/60"><FiLock className="text-brand-red" /><input required type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="w-full bg-transparent outline-none" placeholder="Confirm Password" /></label> : null}
            <label className="flex items-center gap-2 text-sm text-brand-gray"><input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-brand-white/20 bg-brand-black/30" /><span className="flex items-center gap-2"><FiSave /> Save this password locally</span></label>
          </div>

          <button type="submit" className="mt-6 w-full rounded-full bg-gradient-to-r from-brand-red to-brand-red px-4 py-3 font-semibold text-brand-white shadow-[0_0_30px_rgba(var(--accent-rgb),0.2)] transition-transform duration-150 hover:scale-105 hover:shadow-[0_10px_40px_rgba(var(--accent-rgb),0.25)] focus:outline-none focus:ring-4 focus:ring-brand-red/30 active:scale-95">{loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Register'}</button>

          <div className="mt-4 flex items-center justify-between text-sm text-brand-gray">
            <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="hover:text-brand-red">{mode === 'login' ? 'Create Account' : 'Already have an account?'}</button>
            <button type="button" onClick={handleReset} className="hover:text-brand-red">Forgot Password</button>
          </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
