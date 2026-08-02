import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiCheckCircle, FiSave } from 'react-icons/fi';
import { getSession, signInWithEmail, signUpWithEmail, sendPasswordReset } from '../services/supabase';
import { toast } from 'react-hot-toast';

const STORAGE_KEY = 'fit73-saved-credentials';

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
        const { data, error } = await signUpWithEmail({ email: form.email, password: form.password });
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
          toast.success('Welcome back to FIT73');
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
    <div className={"min-h-screen bg-[radial-gradient(circle_at_top,_rgba(var(--accent-rgb),0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(var(--muted-rgb),0.12),_transparent_35%),var(--bg)] px-4 py-10 text-brand-white sm:px-6 lg:px-8"}>
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-8 lg:flex-row">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl text-center lg:text-left">
          <h1 className="text-4xl font-semibold sm:text-5xl lg:text-6xl float">Welcome to your AI-powered training studio.</h1>
        </motion.div>

          <motion.form initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="relative w-full max-w-md rounded-[32px] border border-brand-white/10 bg-brand-white/10 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-8">
            <div className="absolute inset-0 -z-10 rounded-[32px] bg-animated" />
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-brand-red">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</p>
              <h2 className="text-2xl font-semibold">{mode === 'login' ? 'Sign in to continue' : 'Join the performance lab'}</h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-red to-brand-red">
                <FiCheckCircle size={20} className="float-slow" />
            </div>
          </div>

          {resetMessage ? (
            <div className="mb-4 rounded-md border border-brand-white/10 bg-brand-black/20 px-4 py-3 text-sm text-brand-gray">{resetMessage}</div>
          ) : null}

          {mode === 'register' ? (
            <div className="mb-4 space-y-4">
              <label className="group flex items-center gap-3 rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 transition focus-within:border-brand-red/60">
                <FiUser className="text-brand-red" />
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-transparent outline-none" placeholder="Name" />
              </label>
            </div>
          ) : null}

          <div className="space-y-4">
            <label className="group flex items-center gap-3 rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 transition focus-within:border-brand-red/60">
              <FiMail className="text-brand-red" />
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-transparent outline-none" placeholder="Email" />
            </label>
            <label className="group flex items-center gap-3 rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 transition focus-within:border-brand-red/60">
              <FiLock className="text-brand-red" />
              <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full bg-transparent outline-none" placeholder="Password" />
            </label>
            {mode === 'register' ? (
              <label className="group flex items-center gap-3 rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 transition focus-within:border-brand-red/60">
                <FiLock className="text-brand-red" />
                <input required type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="w-full bg-transparent outline-none" placeholder="Confirm Password" />
              </label>
            ) : null}

            <label className="flex items-center gap-2 text-sm text-brand-gray">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-brand-white/20 bg-brand-black/30" />
              <span className="flex items-center gap-2">
                <FiSave /> Save this password locally
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-gradient-to-r from-brand-red to-brand-red px-4 py-3 font-semibold text-brand-white shadow-[0_0_30px_rgba(var(--accent-rgb),0.2)] transition-transform duration-150 hover:scale-105 hover:shadow-[0_10px_40px_rgba(var(--accent-rgb),0.25)] focus:outline-none focus:ring-4 focus:ring-brand-red/30 active:scale-95"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Register'}
          </button>

          <div className="mt-4 flex items-center justify-between text-sm text-brand-gray">
            <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="hover:text-brand-red">
              {mode === 'login' ? 'Create Account' : 'Already have an account?'}
            </button>
            <button type="button" onClick={async () => {
              if (!form.email) {
                toast('Please enter your account email above to receive a reset link.');
                return;
              }
              try {
                setLoading(true);
                setResetMessage('');
                const envRedirect = import.meta.env.VITE_RESET_REDIRECT;
                const redirectTo = envRedirect && envRedirect.length > 0 ? envRedirect : window.location.origin + '/login';
                const { data, error } = await sendPasswordReset(form.email, redirectTo);
                if (error) {
                  const errMsg = error.message || 'Failed to send reset email';
                  setResetMessage(errMsg);
                  toast.error(errMsg);
                } else {
                  const msg = 'Check your email to reset your password. If you do not see it, check your spam folder.';
                  setResetMessage(msg);
                  toast.success('Password reset email sent. Check your inbox.');
                  console.log('Password reset data:', data);
                }
              } catch (err) {
                const errMsg = err?.message || 'Failed to send reset email';
                setResetMessage(errMsg);
                toast.error(errMsg);
              } finally {
                setLoading(false);
              }
            }} className="hover:text-brand-red">Forgot Password</button>
          </div>

          {/* Removed social divider and social buttons */}
        </motion.form>
      </div>
    </div>
  );
}
