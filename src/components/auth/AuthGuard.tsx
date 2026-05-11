import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-primary">Loading Auth...</div>;
  
  return user ? <>{children}</> : null;
};

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-primary">Loading Auth...</div>;

  return !user ? <>{children}</> : null;
};
