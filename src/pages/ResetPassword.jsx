import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiLock } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { updatePassword } from '../services/supabase';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password.length < 6) {
      toast.error('Password must contain at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(password);
    if (error) {
      toast.error(error.message || 'Unable to update password.');
      setLoading(false);
      return;
    }

    toast.success('Password updated successfully.');
    navigate('/');
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-brand-black px-4 py-16 text-brand-white">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-[32px] border border-brand-white/10 bg-brand-white/8 p-6 backdrop-blur-xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div><p className="text-sm text-brand-red">FIT73</p><h1 className="mt-1 text-2xl font-semibold">Set a new password</h1></div>
          <FiCheckCircle className="text-2xl text-brand-red" />
        </div>
        <label className="mb-4 flex items-center gap-3 rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 focus-within:border-brand-red/60"><FiLock className="text-brand-red" /><input required minLength="6" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" className="w-full bg-transparent outline-none" /></label>
        <label className="flex items-center gap-3 rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 focus-within:border-brand-red/60"><FiLock className="text-brand-red" /><input required minLength="6" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm new password" className="w-full bg-transparent outline-none" /></label>
        <button type="submit" disabled={loading} className="mt-6 w-full rounded-full bg-brand-red px-4 py-3 font-semibold">{loading ? 'Updating...' : 'Update password'}</button>
        <Link to="/" className="mt-4 block text-center text-sm text-brand-gray hover:text-brand-red">Back to login</Link>
      </form>
    </div>
  );
}