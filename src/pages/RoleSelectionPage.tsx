import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const { userRole, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (userRole === 'shopkeeper') {
      navigate('/shopkeeper/dashboard', { replace: true });
    } else if (userRole === 'customer') {
      navigate('/home', { replace: true });
    }
    // If no role yet (e.g. just signed up, email not confirmed), stay on this page
  }, [userRole, loading, navigate]);

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="page-container flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  );
};

export default RoleSelectionPage;
