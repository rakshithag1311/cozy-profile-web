import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, Store } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type AuthMode = 'login' | 'signup';
type RoleType = 'customer' | 'shopkeeper';

const AuthPage = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<RoleType>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedShop, setSelectedShop] = useState('');
  const [loading, setLoading] = useState(false);
  const [shops, setShops] = useState<{ id: string; name: string }[]>([]);
  const [shopsFetched, setShopsFetched] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/', { replace: true });
    }
  }, [authLoading, user, navigate]);

  if (!authLoading && user) return null;

  const fetchShops = async () => {
    if (shopsFetched) return;
    const { data } = await supabase.from('shops').select('id, name');
    if (data) setShops(data);
    setShopsFetched(true);
  };

  const handleRoleChange = (r: RoleType) => {
    setRole(r);
    if (r === 'shopkeeper') fetchShops();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === 'signup') {
      const { error } = await signUp(email, password, displayName);
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      // After signup, we need to wait for the user to be created, then assign role
      // The profile is auto-created via trigger. We need to add the role.
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('user_roles').insert({ user_id: user.id, role });
        if (role === 'shopkeeper' && selectedShop) {
          await supabase.from('shop_staff').insert({ user_id: user.id, shop_id: selectedShop });
        }
      }

      toast.success('Account created! Please check your email to verify your account.');
      setMode('login');
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      toast.success('Logged in successfully!');
      // Navigation will be handled by role check in the app
      navigate('/');
    }

    setLoading(false);
  };

  return (
    <div className="page-container fade-in">
      <div className="content-container flex flex-col justify-center min-h-screen">
        <button onClick={() => navigate('/')} className="absolute top-6 left-6 p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            {role === 'customer' ? <User className="w-8 h-8 text-primary" /> : <Store className="w-8 h-8 text-primary" />}
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {mode === 'login' ? 'Sign in to your account' : 'Join Smartfetch today'}
          </p>
        </div>

        {mode === 'signup' && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => handleRoleChange('customer')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${role === 'customer' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
            >
              <User className="w-4 h-4 inline mr-2" />Customer
            </button>
            <button
              onClick={() => handleRoleChange('shopkeeper')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${role === 'shopkeeper' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
            >
              <Store className="w-4 h-4 inline mr-2" />Shopkeeper
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Display Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" className="input-field pl-12" required />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-field pl-12" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" className="input-field pl-12" required minLength={6} />
            </div>
          </div>

          {mode === 'signup' && role === 'shopkeeper' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Select Your Shop</label>
              <select
                value={selectedShop}
                onChange={(e) => setSelectedShop(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Choose a shop...</option>
                {shops.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full mt-6">
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-primary font-semibold hover:underline">
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
