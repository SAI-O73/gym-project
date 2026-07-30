import { Navigate, Outlet } from 'react-router-dom';
import { getSession } from '../services/supabase';

export default function ProtectedRoute() {
  const session = getSession();
  return session ? <Outlet /> : <Navigate to="/" replace />;
}
