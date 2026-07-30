import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getSession, subscribeToAuth } from '../services/supabase';

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const { data } = await getSession();
      if (active) {
        setIsAuthenticated(Boolean(data.session));
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = subscribeToAuth((_event, session) => {
      if (active) {
        setIsAuthenticated(Boolean(session));
        setLoading(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) return null;
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}
