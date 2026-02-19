import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, Store, Zap, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [selectedShop, setSelectedShop] = useState('');
  const [loading, setLoading] = useState(false);
  const [shops, setShops] = useState<{ id: string; name: string }[]>([]);
  const [shopsFetched, setShopsFetched] = useState(false);

  const { userRole } = useAuth();

  useEffect(() => {
    if (!authLoading && user && userRole) {
      if (userRole === 'shopkeeper') {
        navigate('/shopkeeper/dashboard', { replace: true });
      } else {
        navigate('/home', { replace: true });
      }
    }
  }, [authLoading, user, userRole, navigate]);

  // If already logged in with a role, don't show auth page
  if (!authLoading && user && userRole) return null;

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

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('user_roles').insert({ user_id: user.id, role });
        if (role === 'shopkeeper' && selectedShop) {
          await supabase.from('shop_staff').insert({ user_id: user.id, shop_id: selectedShop });
        }
      }

      toast.success('Account created! Please check your email to verify.');
      setMode('login');
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      toast.success('Welcome back!');
      navigate('/');
    }

    setLoading(false);
  };

  return (
    <div className="page-container fade-in">
      <div className="content-container flex flex-col justify-center min-h-screen py-12">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 btn-ghost p-2.5"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center mb-8 fade-in">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 shadow-primary">
            <Zap className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {mode === 'login' ? 'Sign in to your Smartfetch account' : 'Join Smartfetch today'}
          </p>
        </div>

        {/* Role toggle (signup only) */}
        {mode === 'signup' && (
          <div className="flex gap-2 mb-6 p-1.5 bg-secondary rounded-2xl fade-in">
            <button
              type="button"
              onClick={() => handleRoleChange('customer')}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                role === 'customer'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <User className="w-4 h-4" />
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('shopkeeper')}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                role === 'shopkeeper'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Store className="w-4 h-4" />
              Shopkeeper
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 fade-in stagger-1">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Display Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your full name"
                  className="input-field pl-11"
                  required
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field pl-11"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="input-field pl-11 pr-12"
                required
                minLength={6}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && role === 'shopkeeper' && (
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Select Your Shop</label>
              <div className="relative">
                <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <select
                  value={selectedShop}
                  onChange={(e) => setSelectedShop(e.target.value)}
                  className="input-field pl-11 appearance-none"
                  required
                >
                  <option value="">Choose your shop...</option>
                  {shops.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 ml-1">Or create one after signing up</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                Please wait...
              </>
            ) : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle mode */}
        <p className="text-center text-sm text-muted-foreground mt-6 fade-in stagger-2">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-primary font-semibold hover:underline underline-offset-2 transition-colors"
          >
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
