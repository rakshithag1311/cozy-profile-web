import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { User, Store, Zap } from 'lucide-react';
import { toast } from 'sonner';

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const { user, userRole, loading } = useAuth();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (userRole === 'shopkeeper') {
      navigate('/shopkeeper/dashboard', { replace: true });
    } else if (userRole === 'customer') {
      navigate('/home', { replace: true });
    }
  }, [userRole, loading, navigate]);

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // If user already has a role, show redirecting state
  if (userRole) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    );
  }

  const selectRole = async (role: 'customer' | 'shopkeeper') => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('user_roles').insert({ user_id: user.id, role });
    if (error) {
      toast.error('Failed to set role. Please try again.');
      setSaving(false);
      return;
    }
    toast.success(`Welcome as ${role === 'customer' ? 'Customer' : 'Shopkeeper'}!`);
    // Reload to pick up the new role
    window.location.reload();
  };

  return (
    <div className="page-container fade-in">
      <div className="content-container flex flex-col items-center justify-center min-h-screen py-12">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 shadow-primary">
          <Zap className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Choose Your Role</h1>
        <p className="text-muted-foreground text-sm mb-8 text-center">How would you like to use Smartfetch?</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
          <button
            onClick={() => selectRole('customer')}
            disabled={saving}
            className="card-interactive flex flex-col items-center gap-3 p-6 text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <span className="font-semibold text-foreground">Customer</span>
            <span className="text-xs text-muted-foreground">Browse shops &amp; place orders</span>
          </button>

          <button
            onClick={() => selectRole('shopkeeper')}
            disabled={saving}
            className="card-interactive flex flex-col items-center gap-3 p-6 text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Store className="w-6 h-6 text-primary" />
            </div>
            <span className="font-semibold text-foreground">Shopkeeper</span>
            <span className="text-xs text-muted-foreground">Manage your shop &amp; orders</span>
          </button>
        </div>

        {saving && (
          <div className="mt-6 flex items-center gap-2 text-muted-foreground text-sm">
            <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            Setting up your account...
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSelectionPage;
